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
};

test('find_client_by_phone returns [client] when found', async () => {
  nock('https://api.lumenta.test')
    .get('/v1/clients/by-phone')
    .query({ phoneNumber: '201234567890' })
    .reply(200, { data: { id: 'cli_1', phoneNumber: '201234567890' } });

  const result = await appTester(
    App.searches.find_client_by_phone.operation.perform,
    { authData, inputData: { phoneNumber: '201234567890' } },
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'cli_1');
});

test('find_client_by_phone returns [] when no match', async () => {
  nock('https://api.lumenta.test')
    .get('/v1/clients/by-phone')
    .query({ phoneNumber: '999' })
    .reply(200, { data: null });

  const result = await appTester(
    App.searches.find_client_by_phone.operation.perform,
    { authData, inputData: { phoneNumber: '999' } },
  );
  assert.deepEqual(result, []);
});

test('find_template_by_name narrows to exact name match', async () => {
  nock('https://api.lumenta.test')
    .get('/v1/templates')
    .query({ status: 'approved', search: 'spring_sale', language: 'en', limit: 5 })
    .reply(200, {
      data: [
        { id: 'tpl_1', name: 'spring_sale_v2', language: 'en' },
        { id: 'tpl_2', name: 'spring_sale', language: 'en' },
      ],
    });

  const result = await appTester(
    App.searches.find_template_by_name.operation.perform,
    { authData, inputData: { name: 'spring_sale', language: 'en' } },
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'tpl_2');
});
