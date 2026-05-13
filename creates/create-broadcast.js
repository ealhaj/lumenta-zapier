module.exports = {
  key: 'create_broadcast',
  noun: 'Broadcast',
  display: {
    label: 'Create Broadcast',
    description:
      'Create and send a WhatsApp broadcast to a segment using an approved template.',
  },
  operation: {
    inputFields: [
      { key: 'senderId', label: 'Sender', required: true, dynamic: 'senders.id.label' },
      {
        key: 'segmentId',
        label: 'Recipient segment',
        required: true,
        dynamic: 'segments.id.label',
      },
      {
        key: 'templateId',
        label: 'Template',
        required: true,
        dynamic: 'templates.id.label',
      },
      {
        key: 'templateLanguage',
        label: 'Template language',
        required: false,
        default: 'en',
      },
      {
        key: 'name',
        label: 'Broadcast name',
        required: false,
        helpText: 'Optional internal label shown in the Lumenta dashboard.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/broadcasts/templates`,
        method: 'POST',
        body: {
          senderId: bundle.inputData.senderId,
          segmentId: bundle.inputData.segmentId,
          templateId: bundle.inputData.templateId,
          templateLanguage: bundle.inputData.templateLanguage || 'en',
          name: bundle.inputData.name,
        },
      });
      return response.data;
    },
    sample: {
      id: 'bc_abc123',
      status: 'processing',
      totalRecipients: 1500,
      createdAt: '2026-05-14T09:00:00Z',
    },
  },
};
