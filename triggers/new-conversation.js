const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

const performList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/conversations`,
    params: { limit: 3 },
  });
  return (response.data && response.data.data) || [];
};

const SAMPLE = {
  id: 'conv_a13fbeef',
  createdAt: '2026-05-14T09:12:00.000Z',
  lastMessageAt: '2026-05-14T09:12:00.000Z',
  autoReplied: false,
  sender: {
    id: 'snd_xyz',
    displayName: 'Acme Support',
    phoneNumber: '+15551234567',
  },
  client: {
    id: 'cli_abc',
    phoneNumber: '+201234567890',
    profileName: 'Ahmed',
  },
  firstMessage: {
    id: 'msg_8c0e9f',
    body: 'Hi there',
    direction: 'inbound',
    messageType: 'text',
    createdAt: '2026-05-14T09:12:00.000Z',
  },
};

module.exports = {
  key: 'new_conversation',
  noun: 'Conversation',
  display: {
    label: 'New Conversation',
    description:
      'Triggers when a customer starts a fresh conversation with one of your senders (no prior message history).',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('new.conversation'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Conversation ID' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'lastMessageAt', label: 'Last Message At' },
      { key: 'autoReplied', label: 'Auto Replied' },
      { key: 'sender__displayName', label: 'Sender Display Name' },
      { key: 'sender__phoneNumber', label: 'Sender Phone Number' },
      { key: 'client__phoneNumber', label: 'Client Phone Number' },
      { key: 'client__profileName', label: 'Client Profile Name' },
      { key: 'firstMessage__body', label: 'First Message Body' },
    ],
  },
};
