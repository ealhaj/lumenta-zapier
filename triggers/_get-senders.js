/**
 * Hidden trigger backing the `dynamic: 'senders.id.label'` dropdowns
 * in actions. Returns one row per active sender. The `_` prefix on
 * the key keeps it hidden from the Zap editor's trigger picker.
 */
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/senders`,
    params: { status: 'active', limit: 100 },
  });
  const rows = response.data && response.data.data ? response.data.data : [];
  return rows.map((s) => ({
    id: s.id,
    // Zapier surfaces `label` as the dropdown display value when the
    // dynamic field uses `senders.id.label`.
    label: `${s.displayName} (${s.displayPhoneNumber || s.phoneNumber})`,
    displayName: s.displayName,
    phoneNumber: s.phoneNumber,
  }));
};

module.exports = {
  key: 'senders',
  noun: 'Sender',
  display: {
    label: 'List active senders',
    description: 'Internal — populates the sender dropdown in actions.',
    hidden: true,
  },
  operation: {
    perform,
    sample: {
      id: 'snd_xyz',
      label: 'Acme Support (+15551234567)',
      displayName: 'Acme Support',
      phoneNumber: '+15551234567',
    },
  },
};
