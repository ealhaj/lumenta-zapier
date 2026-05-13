module.exports = {
  key: 'find_conversation_by_client',
  noun: 'Conversation',
  display: {
    label: 'Find Conversation by Client',
    description:
      'Look up the active Lumenta conversation for a given client. Useful when chaining a Send Message action after a CRM lookup.',
  },
  operation: {
    inputFields: [
      {
        key: 'clientId',
        label: 'Client ID',
        required: true,
        helpText:
          'The Lumenta client UUID. Chain a "Find Client by Phone" search beforehand to resolve a phone to an id.',
      },
    ],
    perform: async (z, bundle) => {
      // Conversations are indexed by client+user, so filter the list
      // endpoint by clientId. Returns the single matching row (a user
      // has at most one conversation per client by schema constraint).
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/conversations`,
        params: { clientId: bundle.inputData.clientId, limit: 1 },
      });
      const rows = (response.data && response.data.data) || [];
      return rows.slice(0, 1);
    },
    sample: {
      id: 'conv_a13fbeef',
      autoReplied: false,
      lastMessageAt: '2026-05-14T09:12:00Z',
      createdAt: '2026-05-14T09:00:00Z',
    },
  },
};
