module.exports = {
  key: 'add_client_to_segment',
  noun: 'Segment Membership',
  display: {
    label: 'Add Client to Segment',
    description:
      'Add an existing client to a Lumenta segment. The segment can then be used as the recipient list of a campaign.',
  },
  operation: {
    inputFields: [
      {
        key: 'segmentId',
        label: 'Segment',
        required: true,
        dynamic: 'segments.id.label',
      },
      {
        key: 'clientId',
        label: 'Client',
        required: true,
        dynamic: 'clients.id.label',
        helpText:
          'Pick a client, or chain a "Find Client by Phone" search before this step to resolve a phone number to an id.',
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/segments/${bundle.inputData.segmentId}/clients`,
        method: 'POST',
        body: { clientIds: [bundle.inputData.clientId] },
      });
      return response.data || { ok: true };
    },
    sample: { ok: true, added: 1 },
  },
};
