const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

const performList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/messages`,
    params: { direction: 'outbound', limit: 3 },
  });
  return (response.data && response.data.data) || [];
};

const SAMPLE = {
  id: 'msg_8c0e9f1234abcd',
  direction: 'outbound',
  status: 'delivered',
  providerMessageId: 'wamid.HBgL...',
  createdAt: '2026-05-14T09:12:33.000Z',
  sender: {
    id: 'snd_xyz',
    displayName: 'Acme Support',
    phoneNumber: '+15551234567',
  },
};

module.exports = {
  key: 'message_status_updated',
  noun: 'Message',
  display: {
    label: 'Message Status Updated',
    description:
      'Triggers when an outbound message you sent changes status — sent, delivered, read, or failed.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('message.status.updated'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Message ID' },
      { key: 'status', label: 'New Status' },
      { key: 'direction', label: 'Direction' },
      { key: 'providerMessageId', label: 'Provider Message ID' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'sender__displayName', label: 'Sender Display Name' },
    ],
  },
};
