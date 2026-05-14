module.exports = {
  key: 'find_template_by_name',
  noun: 'Template',
  display: {
    label: 'Find Template by Name',
    description:
      'Look up an approved Lumenta template by its WhatsApp name. Returns the template id needed by Send Template Message / Create Campaign.',
  },
  operation: {
    inputFields: [
      { key: 'name', label: 'Template name', required: true },
      {
        key: 'language',
        label: 'Language',
        required: false,
        default: 'en',
        helpText: 'BCP-47 code, e.g. en, en_US, ar, fr.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/templates`,
        params: {
          status: 'approved',
          search: bundle.inputData.name,
          language: bundle.inputData.language,
          limit: 5,
        },
      });
      const rows = (response.data && response.data.data) || [];
      // Approval can coexist with multiple languages — narrow to an
      // exact name match before returning.
      const match = rows.filter((t) => t.name === bundle.inputData.name);
      return match.length > 0 ? [match[0]] : [];
    },
    sample: {
      id: 'tpl_xyz',
      name: 'order_confirmation',
      language: 'en',
      status: 'approved',
    },
  },
};
