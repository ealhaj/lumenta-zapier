const { test } = require('node:test');
const assert = require('node:assert/strict');
const nock = require('nock');
const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const authData = {
  apiKey: 'pk_live_test1234.sk_live_secret5678',
  baseUrl: 'https://api.lumenta.test',
  email: 'test@example.com',
  name: 'Test User',
};

test('authentication test hits /v1/zapier/me with Bearer token', async () => {
  nock('https://api.lumenta.test', {
    reqheaders: {
      authorization: `Bearer ${authData.apiKey}`,
    },
  })
    .get('/v1/zapier/me')
    .reply(200, {
      userId: 'usr_abc',
      tenantId: 'tnt_xyz',
      email: 'test@example.com',
      name: 'Test User',
      activeSenderCount: 2,
    });

  const response = await appTester(App.authentication.test, {
    authData,
  });

  assert.equal(response.data.email, 'test@example.com');
  assert.equal(response.data.activeSenderCount, 2);
  assert.ok(nock.isDone());
});

test('connectionLabel prefers name over email', () => {
  // The connectionLabel is a function on App.authentication; call it
  // with a synthesized bundle.
  const label = App.authentication.connectionLabel(null, {
    inputData: { name: 'Ahmed', email: 'a@example.com' },
  });
  assert.equal(label, 'Ahmed');

  const fallback = App.authentication.connectionLabel(null, {
    inputData: { email: 'a@example.com' },
  });
  assert.equal(fallback, 'a@example.com');
});
