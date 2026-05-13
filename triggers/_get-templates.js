/**
 * Hidden trigger backing the template dropdown in send-template-message
 * and find-template-by-name. Filters to approved-only so users can't
 * select a template that would fail at send time.
 */
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/templates`,
    params: { status: 'approved', limit: 100 },
  });
  const rows = response.data && response.data.data ? response.data.data : [];
  return rows.map((t) => ({
    id: t.id,
    label: `${t.name} (${t.language || 'en'})`,
    name: t.name,
    language: t.language,
  }));
};

module.exports = {
  key: 'templates',
  noun: 'Template',
  display: {
    label: 'List approved templates',
    description: 'Internal — populates the template dropdown.',
    hidden: true,
  },
  operation: {
    perform,
    sample: {
      id: 'tpl_xyz',
      label: 'order_confirmation (en)',
      name: 'order_confirmation',
      language: 'en',
    },
  },
};
