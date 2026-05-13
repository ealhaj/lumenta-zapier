module.exports = {
  key: 'send_text_message',
  noun: 'Message',
  display: {
    label: 'Send Text Message',
    description: 'Send a free-form WhatsApp text message to a phone number.',
  },
  operation: {
    inputFields: [
      {
        key: 'senderId',
        label: 'Sender',
        required: true,
        // Resolve from the hidden _get-senders trigger; the field shows
        // each sender's friendly label.
        dynamic: 'senders.id.label',
      },
      {
        key: 'recipient',
        label: 'Recipient phone number',
        required: true,
        type: 'string',
        helpText:
          'E.164 format with digits only — e.g. 201234567890 (no + or spaces).',
      },
      {
        key: 'body',
        label: 'Message body',
        required: true,
        type: 'text',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/messages/send`,
        method: 'POST',
        body: {
          senderId: bundle.inputData.senderId,
          to: bundle.inputData.recipient,
          body: bundle.inputData.body,
        },
      });
      return response.data;
    },
    sample: {
      id: 'msg_xyz',
      status: 'sent',
      createdAt: '2026-05-14T09:12:33Z',
    },
  },
};
