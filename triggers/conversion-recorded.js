const {
  subscribeHook,
  unsubscribeHook,
  parsePayload,
} = require('./_rest-hook');

/**
 * No bulk endpoint for "recent conversions across all broadcasts" exists
 * yet; the Zap editor's sample picker falls back to the static `sample`
 * below. performList still returns a (potentially empty) array so the
 * "test" tab in the editor doesn't break.
 */
const performList = async (_z, _bundle) => [];

const SAMPLE = {
  id: 'cv_xyz789',
  campaignId: 'bc_abc123',
  // Deprecated alias of campaignId — still emitted for Zaps built before
  // the broadcasts → campaigns rename.
  broadcastId: 'bc_abc123',
  eventType: 'converted',
  recipient: '+201234567890',
  messageSid: 'wamid.HBgL...',
  eventData: { orderTotal: 199.99, currency: 'USD' },
  createdAt: '2026-05-14T11:30:00.000Z',
  campaign: {
    id: 'bc_abc123',
    templateName: 'spring_sale',
    templateLanguage: 'en',
    status: 'completed',
  },
  client: {
    id: 'cli_abc',
    phoneNumber: '+201234567890',
    profileName: 'Ahmed',
  },
  sender: {
    id: 'snd_xyz',
    displayName: 'Acme Support',
    phoneNumber: '+15551234567',
  },
};

module.exports = {
  key: 'conversion_recorded',
  noun: 'Conversion',
  display: {
    label: 'Campaign Conversion Recorded',
    description:
      'Triggers when a recipient takes a tracked action on a campaign — delivered, read, replied, clicked, or converted.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook('conversion.recorded'),
    performUnsubscribe: unsubscribeHook(),
    perform: parsePayload,
    performList,
    sample: SAMPLE,
    outputFields: [
      { key: 'id', label: 'Conversion ID' },
      { key: 'campaignId', label: 'Campaign ID' },
      { key: 'eventType', label: 'Event Type' },
      { key: 'recipient', label: 'Recipient Phone' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'campaign__templateName', label: 'Template Name' },
      { key: 'client__id', label: 'Client ID' },
      { key: 'client__profileName', label: 'Client Profile Name' },
    ],
  },
};
