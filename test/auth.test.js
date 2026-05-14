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

test('authentication test hits /v1/zapier/me with both auth headers', async () => {
  // Middleware attaches both headers for compatibility — Authorization
  // is the documented contract, X-Lumenta-Api-Key keeps older API
  // builds happy. The mock requires *both* be present.
  nock('https://api.lumenta.test', {
    reqheaders: {
      authorization: `Bearer ${authData.apiKey}`,
      'x-lumenta-api-key': authData.apiKey,
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

  assert.equal(response.email, 'test@example.com');
  assert.equal(response.activeSenderCount, 2);
  assert.ok(nock.isDone());
});

test('authentication test rejects a malformed baseUrl before making a request', async () => {
  // D026 mitigation — assertValidBaseUrl runs in beforeRequest and
  // refuses non-https, pathful, or credentialed URLs so a hostile
  // override cannot redirect requests away from Lumenta. Nock is set
  // up but should never be hit because validation fires first.
  const hostile = nock('https://api.lumenta.test').get('/v1/zapier/me').reply(200, {});

  await assert.rejects(
    appTester(App.authentication.test, {
      authData: { ...authData, baseUrl: 'http://api.lumenta.test' },
    }),
    /Invalid Base URL/,
  );
  await assert.rejects(
    appTester(App.authentication.test, {
      authData: { ...authData, baseUrl: 'https://evil.example/api' },
    }),
    /Invalid Base URL/,
  );
  await assert.rejects(
    appTester(App.authentication.test, {
      authData: { ...authData, baseUrl: 'https://attacker:pw@api.lumenta.test' },
    }),
    /Invalid Base URL/,
  );

  assert.equal(hostile.isDone(), false);
  nock.cleanAll();
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
