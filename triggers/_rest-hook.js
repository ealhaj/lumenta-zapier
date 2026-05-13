/**
 * Shared helpers for REST Hook triggers. Every trigger subscribes and
 * unsubscribes against the same /v1/zapier/subscriptions endpoints; the
 * only thing that varies is the event name and the perform/performList
 * payload shape. Hoisting the common pieces avoids drift between the
 * six trigger modules.
 */

function subscribeHook(event) {
  return async (z, bundle) => {
    const response = await z.request({
      url: `${bundle.authData.baseUrl}/v1/zapier/subscriptions`,
      method: 'POST',
      body: { target_url: bundle.targetUrl, event },
    });
    return response.data;
  };
}

function unsubscribeHook() {
  return async (z, bundle) => {
    const id = bundle.subscribeData && bundle.subscribeData.id;
    if (!id) return {};
    const response = await z.request({
      url: `${bundle.authData.baseUrl}/v1/zapier/subscriptions/${id}`,
      method: 'DELETE',
    });
    return response.data || {};
  };
}

/**
 * Zapier delivers the trigger payload as the raw JSON we POSTed to it
 * — `bundle.cleanedRequest`. Return as a single-element array since
 * Zapier expects `perform` to yield "the new things that just happened".
 */
function parsePayload(z, bundle) {
  return [bundle.cleanedRequest];
}

module.exports = { subscribeHook, unsubscribeHook, parsePayload };
