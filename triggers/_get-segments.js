/**
 * Hidden trigger backing the segment dropdown in segment-membership
 * actions and the Create Campaign action.
 */
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/segments`,
    params: { limit: 100 },
  });
  const rows = response.data && response.data.data ? response.data.data : [];
  return rows.map((s) => ({
    id: s.id,
    label: s.name,
    name: s.name,
  }));
};

module.exports = {
  key: 'segments',
  noun: 'Segment',
  display: {
    label: 'List segments',
    description: 'Internal — populates the segment dropdown.',
    hidden: true,
  },
  operation: {
    perform,
    sample: { id: 'seg_xyz', label: 'VIP customers', name: 'VIP customers' },
  },
};
