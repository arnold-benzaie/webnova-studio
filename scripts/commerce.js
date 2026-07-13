/* WebNova commerce adapter — provider-neutral client contract.
   No payment is initiated while checkoutEnabled is false. */

(() => {
  'use strict';

  const getConfig = () => window.WebNovaData?.commerce || {};
  const supportedCurrencies = new Set(['CAD', 'EUR', 'USD', 'MUR']);
  const supportedLocales = new Set(['fr', 'en', 'es', 'pt']);

  function normalizeLineItems(items = []) {
    return items
      .map(({ product, quantity = 1 }) => ({
        productId: product?.id,
        providerPath: product?.providerPath || `${getConfig().productPathPrefix || ''}${product?.id || ''}`,
        quantity: Math.max(1, Math.min(Number(quantity) || 1, 5))
      }))
      .filter((item) => item.productId);
  }

  function createCheckoutContract({ items = [], currency = 'USD', locale = 'en' } = {}) {
    return Object.freeze({
      provider: getConfig().provider || 'fastspring',
      mode: getConfig().mode || 'prelaunch',
      checkoutEnabled: Boolean(getConfig().checkoutEnabled),
      currency: supportedCurrencies.has(currency) ? currency : 'USD',
      locale: supportedLocales.has(locale) ? locale : 'en',
      lineItems: normalizeLineItems(items),
      fulfillment: {
        trigger: 'verified-server-webhook',
        emailConfirmation: true,
        accountLibrary: true,
        signedDownloadLinks: true,
        licenseRecord: true,
        invoiceFromMerchantOfRecord: true
      }
    });
  }

  function readiness() {
    const config = getConfig();
    return {
      providerConfigured: config.provider === 'fastspring',
      currenciesConfigured: Array.isArray(config.currencies) && config.currencies.length === 4,
      clientCheckoutDisabled: !config.checkoutEnabled,
      requiresServerWebhook: config.webhookRequired !== false,
      requiresSecureDelivery: config.secureDeliveryRequired !== false
    };
  }

  window.WebNovaCommerce = Object.freeze({ createCheckoutContract, readiness });
})();
