# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Public Zapier integration for Lumenta WhatsApp Business messaging. Built on `zapier-platform-core` 18.x; deployed via `zapier push` to Zapier's infra. Runs on Node 24 (set by `engines.node` and CI; do not lower).

App identity lives in `.zapierapprc` (`id: 241694`, `key: App241694`) — touching it re-targets a different Zapier app, so leave it alone.

## Commands

```bash
yarn install
yarn test                    # node --test test/*.test.js (nock-backed)
node --test test/auth.test.js   # run a single test file
yarn lint                    # eslint .
yarn validate                # zapier validate — schema check against index.js
yarn build                   # zapier build
yarn push                    # zapier push — needs ZAPIER_DEPLOY_KEY env
```

CI (`.github/workflows/deploy.yml`) runs lint + tests + `zapier validate` on every push and PR to `main`; `zapier push` runs only on `v*.*.*` tags. Releases are cut with `git tag -a vX.Y.Z` — bump `package.json` `version` first so the tag and the value Zapier records match.

## Architecture

`index.js` is the single registration point. Each trigger/create/search is a self-contained module exporting `{ key, noun, display, operation }`; `index.js` requires them and wires them into the three top-level maps. To add a new action, drop a file under `creates/`, require it in `index.js`, and add it to the `creates` map — there is no auto-discovery.

### Auth + middleware (`authentication.js`, `middleware.js`)
- Custom auth: user pastes a `pk_live_…` API key. Test URL `/v1/zapier/me`.
- `beforeRequest` (`addApiKeyHeader`) attaches BOTH `Authorization: Bearer …` AND `X-Lumenta-Api-Key: …` to every outbound request. The dual headers are deliberate (the test in `test/auth.test.js` asserts both via `reqheaders`) — Authorization is the documented contract, X-Lumenta-Api-Key keeps older Lumenta API builds happy. Don't drop one without removing the test assertion.
- `afterResponse` (`handleErrors`) unwraps Lumenta's `{ error: { code, message } }` envelope. 401/403 throws `RefreshAuthError` (Zapier re-prompts the user to reconnect); everything else throws `z.errors.Error` with the code and status.

### REST Hook triggers (`triggers/*.js`)
The six user-facing triggers (`message-received`, `new-conversation`, `message-status-updated`, `broadcast-completed`, `conversion-recorded`, `client-created`) all subscribe via `POST /v1/zapier/subscriptions` with `{ target_url, event }` and unsubscribe via `DELETE /v1/zapier/subscriptions/:id`. Shared helpers live in `triggers/_rest-hook.js` (`subscribeHook(event)`, `unsubscribeHook()`, `parsePayload`). New REST Hook triggers should reuse these — don't reimplement subscribe/unsubscribe.

Each trigger also provides a `performList` that hits a list endpoint so Zapier can populate sample data when the user hasn't fired a real webhook yet. The `SAMPLE` constant + `outputFields` array power the Zap editor's field picker; keep them in sync with the runtime payload shape that `ZapierPayloadBuilder` produces on the Lumenta side.

### Hidden dropdown triggers (`triggers/_*.js`)
`_get-senders`, `_get-templates`, `_get-segments` have `display.hidden: true` and the `_` filename prefix. They back the `dynamic: '<key>.id.label'` fields in actions (e.g. `dynamic: 'senders.id.label'` in `send-text-message.js`). Pattern: return `{ id, label, …extras }` rows; `label` is the dropdown display value.

### Creates + searches
Creates (`creates/`) are plain async `perform` functions that `z.request` to a Lumenta endpoint and return `response.data`. Searches (`searches/`) are intended to combine with creates via Zapier's "Find or Create" toggle.

## Tests

Tests use Node's built-in test runner (`node --test`) with `nock` for HTTP mocking and `zapier.createAppTester(App)` to invoke operations. When adding a test, mirror the existing pattern: declare `nock(...).reqheaders(...)` expectations to assert both auth headers are sent, then `assert.ok(nock.isDone())` at the end so missing requests fail loudly.

## Breaking changes

`zapier push` of a backwards-incompatible change (renamed fields, removed triggers, changed input keys) requires a manual `zapier migrate <fromVersion> <toVersion>` after deploy to move existing Zaps to the new version. Don't rename action `key`s without a migration plan — live Zaps reference them.
