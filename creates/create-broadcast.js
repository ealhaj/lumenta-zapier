module.exports = {
  // Key kept as `create_broadcast` so Zaps built before the broadcasts →
  // campaigns rename keep working — Zapier identifies actions by key.
  key: 'create_broadcast',
  noun: 'Campaign',
  display: {
    label: 'Create Campaign',
    description:
      'Create and send a WhatsApp campaign to a segment using an approved template.',
  },
  operation: {
    inputFields: [
      {
        key: 'senderId',
        label: 'Sender',
        required: true,
        dynamic: 'senders.id.label',
      },
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
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/campaigns/templates`,
        method: 'POST',
        body: {
          senderId: bundle.inputData.senderId,
          templateId: bundle.inputData.templateId,
          // The combined recipient picker on the API takes segments and
          // individual clients; a Zap supplies a single segment.
          recipients: { segmentIds: [bundle.inputData.segmentId] },
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
