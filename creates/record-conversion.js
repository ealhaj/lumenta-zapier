module.exports = {
  key: 'record_conversion',
  noun: 'Conversion',
  display: {
    label: 'Record Broadcast Conversion',
    description:
      'Attribute a conversion event to a Lumenta broadcast. Use this to feed downstream-revenue or click signals back into Lumenta from any source (your CRM, store, analytics tool).',
  },
  operation: {
    inputFields: [
      {
        key: 'broadcastId',
        label: 'Broadcast',
        required: true,
        dynamic: 'broadcasts.id.label',
      },
      {
        key: 'recipient',
        label: 'Recipient phone number',
        required: true,
        helpText: 'E.164 with digits only — the same phone that received the broadcast.',
      },
      {
        key: 'eventType',
        label: 'Event type',
        required: true,
        choices: {
          delivered: 'Delivered',
          read: 'Read',
          replied: 'Replied',
          clicked: 'Clicked',
          converted: 'Converted (revenue)',
        },
      },
      {
        key: 'eventData',
        label: 'Event metadata',
        type: 'string',
        dict: true,
        required: false,
        helpText:
          'Free-form key/value pairs for analytics — e.g. orderTotal=199.99, currency=USD.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/broadcasts/${bundle.inputData.broadcastId}/conversions`,
        method: 'POST',
        body: {
          recipient: bundle.inputData.recipient,
          eventType: bundle.inputData.eventType,
          eventData: bundle.inputData.eventData,
        },
      });
      return (response.data && response.data.data) || response.data;
    },
    sample: {
      id: 'cv_xyz789',
      broadcastId: 'bc_abc123',
      eventType: 'converted',
      recipient: '+201234567890',
      createdAt: '2026-05-14T11:30:00Z',
    },
  },
};
