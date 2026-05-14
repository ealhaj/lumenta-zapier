/**
 * Custom auth. The user pastes a Lumenta API key (pk_live_*.*) into
 * Zapier's connection dialog; we send it as Bearer on every request.
 * The Lumenta side (api/src/auth/guards/jwt-auth.guard.ts) recognises
 * the `pk_live_` prefix and routes the request through ApiKeysService
 * instead of the JWT strategy.
 */
module.exports = {
  type: 'custom',
  test: {
    url: '{{bundle.authData.baseUrl}}/v1/zapier/me',
    method: 'GET',
  },
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Generate one on the [API Keys](https://lumenta.co/settings/api-keys) page in your Lumenta dashboard. Use the "Zapier bundle" preset to pre-fill the required scopes.',
    },
    {
      key: 'baseUrl',
      label: 'Base URL',
      required: false,
      default: 'https://api.lumenta.co',
      helpText:
        'Leave as default unless you are on a self-hosted Lumenta deployment. See the [self-hosting guide](https://docs.lumenta.co/self-hosting) for details.',
    },
  ],
  // Connection label shown in Zapier's "My Apps" panel. /v1/zapier/me
  // returns { email, name, tenantId, activeSenderCount } — display the
  // human-readable name and fall back to email if name is unset.
  connectionLabel: (z, bundle) => {
    const name = bundle.inputData && bundle.inputData.name;
    const email = bundle.inputData && bundle.inputData.email;
    return name || email || 'Lumenta';
  },
};
