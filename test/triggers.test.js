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

const TARGET_URL = 'https://hooks.zapier.com/hooks/standard/12345/abcdef';

test('message_received subscribe POSTs to /v1/zapier/subscriptions', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/zapier/subscriptions', (body) => {
      assert.equal(body.target_url, TARGET_URL);
      assert.equal(body.event, 'message.received');
      return true;
    })
    .reply(201, { id: 'sub_xyz', target_url: TARGET_URL, event: 'message.received' });

  const result = await appTester(
    App.triggers.message_received.operation.performSubscribe,
    { authData, targetUrl: TARGET_URL },
  );

  assert.equal(result.id, 'sub_xyz');
  assert.ok(nock.isDone());
});

test('new_conversation subscribe passes the right event name', async () => {
  nock('https://api.lumenta.test')
    .post('/v1/zapier/subscriptions', (body) => body.event === 'new.conversation')
    .reply(201, { id: 'sub_nc', target_url: TARGET_URL, event: 'new.conversation' });

  await appTester(
    App.triggers.new_conversation.operation.performSubscribe,
    { authData, targetUrl: TARGET_URL },
  );
  assert.ok(nock.isDone());
});

test('unsubscribe DELETEs the subscription by id', async () => {
  nock('https://api.lumenta.test')
    .delete('/v1/zapier/subscriptions/sub_xyz')
    .reply(204);

  await appTester(App.triggers.message_received.operation.performUnsubscribe, {
    authData,
    subscribeData: { id: 'sub_xyz' },
  });
  assert.ok(nock.isDone());
});

test('perform returns the raw webhook body as a single-element array', async () => {
  const incoming = { id: 'msg_abc', body: 'Hello' };
  const result = await appTester(
    App.triggers.message_received.operation.perform,
    { authData, cleanedRequest: incoming },
  );
  assert.deepEqual(result, [incoming]);
});

test('_get-senders dropdown returns mapped { id, label } rows', async () => {
  nock('https://api.lumenta.test')
    .get('/v1/senders')
    .query({ status: 'active', limit: 100 })
    .reply(200, {
      data: [
        {
          id: 'snd_1',
          displayName: 'Acme',
          phoneNumber: '+15551234567',
          displayPhoneNumber: '+1 (555) 123-4567',
        },
      ],
    });

  const rows = await appTester(App.triggers.senders.operation.perform, {
    authData,
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 'snd_1');
  assert.match(rows[0].label, /Acme/);
});
