# Lumenta · Zapier integration

Public Zapier app that connects Lumenta WhatsApp Business messaging to 8,000+ apps in the Zapier directory.

## Repository layout

```
zapier/
├── index.js                ← App definition wired to triggers, creates, searches
├── authentication.js       ← Custom auth (API key)
├── middleware.js           ← Attaches X-Lumenta-Api-Key header to every request
├── triggers/               ← REST Hook triggers (6) + hidden dropdown helpers (3)
├── creates/                ← Actions (8)
├── searches/               ← Searches (3)
├── test/                   ← nock-backed unit tests + zapier validate
└── .github/workflows/      ← CI: test on push, zapier push on tag
```

## Auth contract

Users paste a Lumenta API key (`pk_live_…`) into Zapier's connection dialog. The app sends it as `Authorization: Bearer pk_live_…` on every request. The Lumenta side recognises the prefix and routes through `ApiKeysService.authenticate` instead of the JWT strategy.

Minimum scope bundle on the key: `clients:read`, `clients:write`, `conversations:read`, `messages:read`, `messages:write`, `templates:read`, `segments:read`, `senders:read`, `broadcasts:write`, `webhooks:manage`. The Lumenta portal pre-selects this bundle when the user clicks "Zapier bundle" in the API key creation modal.

## Development

```bash
yarn install
yarn test              # Run unit tests
yarn validate          # zapier validate (schema check)
yarn push              # zapier push (requires ZAPIER_DEPLOY_KEY)
```

## CI

- Tests run on every push to `main`.
- `zapier push` runs on tagged releases (`v*.*.*`).

## Deployment

Releases are tagged via `git tag -a vX.Y.Z` and pushed. GitHub Actions handles `zapier push`. Breaking changes go through `zapier migrate` so existing Zaps keep working.
