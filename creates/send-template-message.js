module.exports = {
  key: 'send_template_message',
  noun: 'Template Message',
  display: {
    label: 'Send Template Message',
    description:
      'Send an approved WhatsApp template message. Variables are positional and substituted into {{1}}, {{2}}, … placeholders in order.',
  },
  operation: {
    inputFields: [
      { key: 'senderId', label: 'Sender', required: true, dynamic: 'senders.id.label' },
      {
        key: 'recipient',
        label: 'Recipient phone number',
        required: true,
        type: 'string',
        helpText: 'E.164 format with digits only — e.g. 201234567890.',
      },
      {
        key: 'templateId',
        label: 'Template',
        required: true,
        dynamic: 'templates.id.label',
      },
      {
        key: 'variables',
        label: 'Template variables',
        type: 'string',
        list: true,
        helpText:
          'One input per {{1}}, {{2}}, … placeholder in the template body, in order.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/messages/templates`,
        method: 'POST',
        body: {
          senderId: bundle.inputData.senderId,
          to: bundle.inputData.recipient,
          templateId: bundle.inputData.templateId,
          // Lumenta accepts an object {1: '...', 2: '...'} mapping
          // placeholder ordinal → value. Map the user's array.
          templateVariables: (bundle.inputData.variables || []).reduce(
            (acc, v, i) => {
              acc[String(i + 1)] = v;
              return acc;
            },
            {},
          ),
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
