const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

const performList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/broadcasts`,
    params: { status: 'COMPLETED', limit: 3 },
  });
  return (response.data && response.data.data) || [];
};

const SAMPLE = {
  id: 'bc_abc123',
  status: 'completed',
  type: 'template',
  totalRecipients: 1500,
  sent: 1487,
  failed: 13,
  templateName: 'spring_sale',
  templateLanguage: 'en',
  errorMessage: null,
  scheduledFor: null,
  completedAt: '2026-05-14T10:00:00.000Z',
  createdAt: '2026-05-14T09:00:00.000Z',
  sender: {
    id: 'snd_xyz',
    displayName: 'Acme Support',
    phoneNumber: '+15551234567',
  },
};

module.exports = {
  key: 'broadcast_completed',
  noun: 'Broadcast',
  display: {
    label: 'Broadcast Completed',
    description:
      'Triggers when a broadcast campaign finishes sending. Fires once per broadcast with the final tally.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('broadcast.completed'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Broadcast ID' },
      { key: 'status', label: 'Final Status' },
      { key: 'type', label: 'Broadcast Type' },
      { key: 'totalRecipients', label: 'Total Recipients', type: 'integer' },
      { key: 'sent', label: 'Sent', type: 'integer' },
      { key: 'failed', label: 'Failed', type: 'integer' },
      { key: 'templateName', label: 'Template Name' },
      { key: 'templateLanguage', label: 'Template Language' },
      { key: 'errorMessage', label: 'Error Message' },
      { key: 'completedAt', label: 'Completed At', type: 'datetime' },
    ],
  },
};
