import { createHmac, timingSafeEqual } from 'node:crypto';

export const FASTSPRING_SIGNATURE_HEADER = 'x-fs-signature';
export const SUPPORTED_EVENTS = new Set(['order.completed', 'order.failed', 'order.canceled', 'fulfillment.failed', 'return.created']);

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('base64');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(signature));
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function parseWebhookEnvelope(rawBody) {
  const payload = JSON.parse(rawBody);
  if (!payload || !Array.isArray(payload.events)) throw new TypeError('FastSpring webhook payload must contain an events array.');
  return payload.events.map((event) => {
    if (!event?.id || !event?.type) throw new TypeError('Every FastSpring event must include an id and type.');
    return {
      id: String(event.id),
      type: String(event.type),
      live: Boolean(event.live),
      created: Number(event.created || 0),
      data: event.data || {}
    };
  });
}

export async function processWebhookEvents(events, dependencies) {
  const { hasProcessed, markProcessed, onOrderCompleted, onOperationalEvent } = dependencies;
  const results = [];
  for (const event of events) {
    if (!SUPPORTED_EVENTS.has(event.type)) {
      results.push({ id: event.id, status: 'ignored', reason: 'unsupported-event' });
      continue;
    }
    if (await hasProcessed(event.id)) {
      results.push({ id: event.id, status: 'duplicate' });
      continue;
    }
    if (event.type === 'order.completed') {
      await onOrderCompleted(event);
    } else {
      await onOperationalEvent(event);
    }
    await markProcessed(event.id);
    results.push({ id: event.id, status: 'processed' });
  }
  return results;
}

export function fulfillmentRequirements() {
  return Object.freeze({
    verifyRawBodyBeforeJsonParsing: true,
    deduplicateByEventId: true,
    grantOnlyFromOrderCompleted: true,
    signedDownloadLinks: true,
    persistOrderAndLicense: true,
    transactionalEmail: true,
    invoiceFromMerchantOfRecord: true
  });
}
