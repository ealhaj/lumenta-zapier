module.exports = {
  key: 'remove_client_from_segment',
  noun: 'Segment Membership',
  display: {
    label: 'Remove Client from Segment',
    description: 'Remove a client from a Lumenta segment.',
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
      },
    ],
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${bundle.authData.baseUrl}/v1/segments/${bundle.inputData.segmentId}/clients`,
        method: 'DELETE',
        body: { clientIds: [bundle.inputData.clientId] },
      });
      return response.data || { ok: true };
    },
    sample: { ok: true, removed: 1 },
  },
};
