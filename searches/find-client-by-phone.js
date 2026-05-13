module.exports = {
  key: 'find_client_by_phone',
  noun: 'Client',
  display: {
    label: 'Find Client by Phone',
    description:
      'Look up a Lumenta client by exact phone number. Pair with the Add Client action via Zapier\'s "Find or Create" toggle to resolve-or-create in one step.',
  },
  operation: {
    inputFields: [
      {
        key: 'phoneNumber',
        label: 'Phone number',
        required: true,
        helpText: 'E.164 with digits only — e.g. 201234567890.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/clients/by-phone`,
        params: { phoneNumber: bundle.inputData.phoneNumber },
      });
      const client = response.data && response.data.data;
      return client ? [client] : [];
    },
    sample: {
      id: 'cli_abc',
      phoneNumber: '201234567890',
      profileName: 'Ahmed',
      createdAt: '2026-05-14T09:00:00Z',
    },
  },
};
