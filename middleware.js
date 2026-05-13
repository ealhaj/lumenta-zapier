/**
 * beforeRequest middleware — attaches the Lumenta API key as a Bearer
 * token to every outbound HTTPS request. The Lumenta JwtAuthGuard
 * detects the `pk_live_` prefix and routes auth through
 * ApiKeysService.authenticate.
 *
 * Skipped when bundle.authData.apiKey is missing so the auth-test
 * call itself (which fires before the user has saved credentials)
 * doesn't blow up — Zapier's runtime calls authentication.test with
 * the just-submitted form values already populated.
 */
const addApiKeyHeader = (request, z, bundle) => {
  if (bundle && bundle.authData && bundle.authData.apiKey) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

/**
 * afterResponse middleware — Zapier's runtime treats a 410 from a
 * subscription hook delivery as "Zap deleted", but for our REST API
 * calls (actions, searches, dropdown triggers) we should surface
 * Lumenta's error messages cleanly. This turns the typed Lumenta
 * error envelope into a Zapier-friendly z.errors.Error so the Zap
 * editor shows the message instead of a generic "Bad request".
 */
const handleErrors = (response, z) => {
  if (response.status < 400) return response;

  // Lumenta's errors follow { error: { code, message, ... } } via
  // GlobalExceptionFilter (api/src/common/filters/global-exception.filter.ts).
  const body = response.data || {};
  const msg =
    (body.error && body.error.message) ||
    body.message ||
    response.content ||
    `Lumenta returned ${response.status}`;
  // 401/403 → re-auth so Zapier prompts the user to reconnect.
  if (response.status === 401 || response.status === 403) {
    throw new z.errors.RefreshAuthError(msg);
  }
  throw new z.errors.Error(msg, body.error && body.error.code, response.status);
};

module.exports = { addApiKeyHeader, handleErrors };
