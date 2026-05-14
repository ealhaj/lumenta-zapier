/**
 * Hidden trigger backing the `dynamic: 'broadcasts.id.label'` dropdown
 * in the Record Broadcast Conversion action. Returns recently
 * completed broadcasts since conversions are only meaningful for
 * broadcasts that have actually been delivered.
 */
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/broadcasts`,
    params: { status: 'completed', limit: 100 },
  });
  const rows = response.data && response.data.data ? response.data.data : [];
  return rows.map((b) => {
    const name = b.templateName || b.name || b.id;
    const when = b.completedAt || b.createdAt;
    return {
      id: b.id,
      label: when ? `${name} — ${when}` : name,
      templateName: b.templateName,
      completedAt: b.completedAt,
    };
  });
};

module.exports = {
  key: 'broadcasts',
  noun: 'Broadcast',
  display: {
    label: 'List recent broadcasts',
    description: 'Internal — populates the broadcast dropdown in actions.',
    hidden: true,
  },
  operation: {
    perform,
    sample: {
      id: 'bc_abc123',
      label: 'spring_sale — 2026-05-14T10:00:00.000Z',
      templateName: 'spring_sale',
      completedAt: '2026-05-14T10:00:00.000Z',
    },
  },
};
