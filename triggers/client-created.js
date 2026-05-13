const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

const performList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/clients`,
    params: { limit: 3 },
  });
  return (response.data && response.data.data) || [];
};

const SAMPLE = {
  id: 'cli_abc',
  phoneNumber: '+201234567890',
  profileName: 'Ahmed',
  createdAt: '2026-05-14T09:00:00.000Z',
};

module.exports = {
  key: 'client_created',
  noun: 'Client',
  display: {
    label: 'New Client',
    description:
      'Triggers when a new contact (client) is added to your Lumenta workspace — whether imported manually or seen for the first time via WhatsApp.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('client.created'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Client ID' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'profileName', label: 'Profile Name' },
      { key: 'createdAt', label: 'Created At' },
    ],
  },
};
