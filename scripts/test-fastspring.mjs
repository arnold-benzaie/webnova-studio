import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import {
  verifyWebhookSignature,
  parseWebhookEnvelope,
  processWebhookEvents,
  fulfillmentRequirements
} from '../integrations/fastspring/webhook-contract.mjs';

const secret = 'local-test-secret';
const rawBody = JSON.stringify({
  events: [{ id: 'evt_test_1', type: 'order.completed', live: false, created: 1, data: { order: 'test-order' } }]
});
const signature = createHmac('sha256', secret).update(rawBody).digest('base64');

assert.equal(verifyWebhookSignature(rawBody, signature, secret), true);
assert.equal(verifyWebhookSignature(rawBody, 'invalid', secret), false);

const events = parseWebhookEnvelope(rawBody);
assert.equal(events.length, 1);
assert.equal(events[0].type, 'order.completed');

const processed = new Set();
let fulfilled = 0;
const dependencies = {
  hasProcessed: async (id) => processed.has(id),
  markProcessed: async (id) => processed.add(id),
  onOrderCompleted: async () => { fulfilled += 1; },
  onOperationalEvent: async () => {}
};

const firstResult = await processWebhookEvents(events, dependencies);
const duplicateResult = await processWebhookEvents(events, dependencies);
assert.equal(firstResult[0].status, 'processed');
assert.equal(duplicateResult[0].status, 'duplicate');
assert.equal(fulfilled, 1);

const requirements = fulfillmentRequirements();
for (const key of [
  'verifyRawBodyBeforeJsonParsing', 'deduplicateByEventId', 'grantOnlyFromOrderCompleted',
  'signedDownloadLinks', 'persistOrderAndLicense', 'transactionalEmail', 'invoiceFromMerchantOfRecord'
]) {
  assert.equal(requirements[key], true, `Missing fulfilment requirement: ${key}`);
}

console.log('FastSpring contract checks passed.');
