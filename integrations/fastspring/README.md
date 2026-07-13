# FastSpring integration contract

This directory prepares the integration without loading FastSpring or accepting payments.

## Activation sequence

1. Obtain FastSpring approval and create stable product paths matching `webnova-<product-id>`.
2. Create a branded popup or hosted checkout and whitelist `webnova.company`.
3. Start with the FastSpring test storefront; do not expose a live checkout during validation.
4. Store API credentials, Store Builder keys and the webhook HMAC secret only in server-side secrets.
5. Configure the HTTPS webhook endpoint for the events listed in `config.example.json`.
6. Verify the raw request body against `X-FS-Signature` with HMAC SHA-256 before JSON parsing.
7. Deduplicate every event by event ID. Process fulfillment only from a verified `order.completed` event.
8. Persist the order, customer entitlement and licence before issuing a signed download link.
9. Send the confirmation email and expose the order, licence, invoice and file in the authenticated account.
10. Test success, failure, retry, duplicate delivery, refund and fulfillment failure before enabling production.

Official references:

- https://developer.fastspring.com/reference/store-builder-library-overview
- https://developer.fastspring.com/reference/webhooks-overview
- https://developer.fastspring.com/reference/message-security
- https://developer.fastspring.com/docs/fulfillments

`webhook-contract.mjs` contains no credentials and performs no network call. It defines signature verification, envelope validation, deduplication hooks and the fulfillment boundary that the future backend must implement.
