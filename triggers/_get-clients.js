/**
 * Hidden trigger backing the `dynamic: 'clients.id.label'` dropdowns
 * in actions and searches that take a `clientId`. Returns recent
 * clients; users can also paste a raw id (Zapier's "Custom" mode) when
 * the client they want is older than the listed page.
 */
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/v1/clients`,
    params: { limit: 100 },
  });
  const rows = response.data && response.data.data ? response.data.data : [];
  return rows.map((c) => {
    const phone = c.phoneNumber || '';
    const name = c.profileName || phone || c.id;
    return {
      id: c.id,
      label: phone ? `${name} (${phone})` : name,
      phoneNumber: c.phoneNumber,
      profileName: c.profileName,
    };
  });
};

module.exports = {
  key: 'clients',
  noun: 'Client',
  display: {
    label: 'List recent clients',
    description: 'Internal — populates the client dropdown in actions.',
    hidden: true,
  },
  operation: {
    perform,
    sample: {
      id: 'cli_abc',
      label: 'Ahmed (+201234567890)',
      phoneNumber: '+201234567890',
      profileName: 'Ahmed',
    },
  },
};
