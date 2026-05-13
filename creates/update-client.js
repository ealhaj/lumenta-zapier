module.exports = {
  key: 'update_client',
  noun: 'Client',
  display: {
    label: 'Update Client',
    description:
      "Update a client's profile name. Phone numbers are immutable — add a new client to change the phone.",
  },
  operation: {
    inputFields: [
      {
        key: 'clientId',
        label: 'Client ID',
        required: true,
        helpText:
          'The Lumenta client UUID. Use a "Find Client by Phone" search step beforehand to resolve a phone number to an id.',
      },
      { key: 'profileName', label: 'Profile name', required: true },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/clients/${bundle.inputData.clientId}`,
        method: 'PATCH',
        body: { profileName: bundle.inputData.profileName },
      });
      return (response.data && response.data.data) || response.data;
    },
    sample: {
      id: 'cli_abc',
      phoneNumber: '201234567890',
      profileName: 'Ahmed Hassan',
      createdAt: '2026-05-14T09:00:00Z',
    },
  },
};
