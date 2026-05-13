module.exports = {
  key: 'add_client',
  noun: 'Client',
  display: {
    label: 'Add Client',
    description:
      'Add a contact to your Lumenta workspace. If a client with this phone number already exists, the profile name is updated instead of creating a duplicate.',
  },
  operation: {
    inputFields: [
      {
        key: 'phoneNumber',
        label: 'Phone number',
        required: true,
        helpText: 'E.164 with digits only — e.g. 201234567890.',
      },
      { key: 'profileName', label: 'Profile name', required: false },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/clients`,
        method: 'POST',
        body: {
          phoneNumber: bundle.inputData.phoneNumber,
          profileName: bundle.inputData.profileName,
        },
      });
      return (response.data && response.data.data) || response.data;
    },
    sample: {
      id: 'cli_abc',
      phoneNumber: '201234567890',
      profileName: 'Ahmed',
      createdAt: '2026-05-14T09:00:00Z',
    },
  },
};
