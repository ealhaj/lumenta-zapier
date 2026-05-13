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

test('send_text_message POSTs to /v1/messages/send', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/messages/send', {
      senderId: 'snd_1',
      to: '201234567890',
      body: 'Hi',
    })
    .reply(201, { id: 'msg_1', status: 'sent' });

  const result = await appTester(
    App.creates.send_text_message.operation.perform,
    {
      authData,
      inputData: { senderId: 'snd_1', recipient: '201234567890', body: 'Hi' },
    },
  );
  assert.equal(result.id, 'msg_1');
  assert.ok(nock.isDone());
});

test('send_template_message maps variables array to numeric-keyed object', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/messages/templates', (body) => {
      assert.deepEqual(body.templateVariables, { 1: 'Ahmed', 2: 'tomorrow' });
      return true;
    })
    .reply(201, { id: 'msg_2', status: 'sent' });

  await appTester(App.creates.send_template_message.operation.perform, {
    authData,
    inputData: {
      senderId: 'snd_1',
      recipient: '201234567890',
      templateId: 'tpl_xyz',
      variables: ['Ahmed', 'tomorrow'],
    },
  });
  assert.ok(nock.isDone());
});

test('add_client POSTs to /v1/clients', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/clients', { phoneNumber: '201234567890', profileName: 'A' })
    .reply(201, { data: { id: 'cli_1', phoneNumber: '201234567890', profileName: 'A' } });

  const result = await appTester(App.creates.add_client.operation.perform, {
    authData,
    inputData: { phoneNumber: '201234567890', profileName: 'A' },
  });
  assert.equal(result.id, 'cli_1');
});

test('update_client PATCHes profileName', async () => {
  nock('https://api.lumenta.test')
    .patch('/v1/clients/cli_1', { profileName: 'B' })
    .reply(200, { data: { id: 'cli_1', profileName: 'B' } });

  const result = await appTester(App.creates.update_client.operation.perform, {
    authData,
    inputData: { clientId: 'cli_1', profileName: 'B' },
  });
  assert.equal(result.profileName, 'B');
});

test('record_conversion POSTs to /broadcasts/:id/conversions', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/broadcasts/bc_1/conversions', (body) => {
      assert.equal(body.recipient, '201234567890');
      assert.equal(body.eventType, 'converted');
      return true;
    })
    .reply(201, { data: { id: 'cv_1' } });

  await appTester(App.creates.record_conversion.operation.perform, {
    authData,
    inputData: {
      broadcastId: 'bc_1',
      recipient: '201234567890',
      eventType: 'converted',
      eventData: { orderTotal: 199.99 },
    },
  });
  assert.ok(nock.isDone());
});
