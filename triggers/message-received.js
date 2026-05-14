const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

/**
 * Fetches a recent inbound message to populate the Zap editor's sample
 * data + load the user's "test" tab. Mirrors the runtime payload shape
 * defined by ZapierPayloadBuilder.buildMessageReceived in the API.
 */
const performList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/messages`,
    params: { direction: 'inbound', limit: 3 },
  });
  return (response.data && response.data.data) || [];
};

const SAMPLE = {
  id: 'msg_8c0e9f1234abcd',
  conversationId: 'conv_a13fbeef',
  direction: 'inbound',
  messageType: 'text',
  body: 'Hi, do you have this in stock?',
  mediaUrl: null,
  mediaMimeType: null,
  createdAt: '2026-05-14T09:12:33.000Z',
  sender: {
    id: 'snd_xyz',
    displayName: 'Acme Support',
    phoneNumber: '+15551234567',
    displayPhoneNumber: '+1 (555) 123-4567',
  },
  client: {
    id: 'cli_abc',
    phoneNumber: '+201234567890',
    profileName: 'Ahmed',
  },
};

module.exports = {
  key: 'message_received',
  noun: 'Message',
  display: {
    label: 'New Inbound Message',
    description:
      'Triggers when a customer sends a WhatsApp message to one of your senders.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('message.received'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Message ID' },
      { key: 'conversationId', label: 'Conversation ID' },
      { key: 'direction', label: 'Direction' },
      { key: 'messageType', label: 'Message Type' },
      { key: 'body', label: 'Message Body' },
      { key: 'mediaUrl', label: 'Media URL' },
      { key: 'mediaMimeType', label: 'Media MIME Type' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'sender__id', label: 'Sender ID' },
      { key: 'sender__displayName', label: 'Sender Display Name' },
      { key: 'sender__phoneNumber', label: 'Sender Phone Number' },
      { key: 'client__id', label: 'Client ID' },
      { key: 'client__phoneNumber', label: 'Client Phone Number' },
      { key: 'client__profileName', label: 'Client Profile Name' },
    ],
  },
};
