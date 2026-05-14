const { version: platformVersion } = require('zapier-platform-core');
const packageJson = require('./package.json');
const authentication = require('./authentication');
const { addApiKeyHeader, handleErrors } = require('./middleware');

// Triggers — REST Hooks (subscribed by Zapier when a Zap is enabled).
const messageReceived = require('./triggers/message-received');
const messageStatusUpdated = require('./triggers/message-status-updated');
const broadcastCompleted = require('./triggers/broadcast-completed');
const conversionRecorded = require('./triggers/conversion-recorded');
const clientCreated = require('./triggers/client-created');

// Hidden triggers — power dynamic dropdowns in actions/searches. Key
// prefix `_` keeps them out of the Zap editor's trigger list.
const getSenders = require('./triggers/_get-senders');
const getTemplates = require('./triggers/_get-templates');
const getSegments = require('./triggers/_get-segments');
const getClients = require('./triggers/_get-clients');
const getBroadcasts = require('./triggers/_get-broadcasts');

// Creates (actions).
const sendTextMessage = require('./creates/send-text-message');
const sendTemplateMessage = require('./creates/send-template-message');
const createBroadcast = require('./creates/create-broadcast');
const addClient = require('./creates/add-client');
const updateClient = require('./creates/update-client');
const addClientToSegment = require('./creates/add-client-to-segment');
const removeClientFromSegment = require('./creates/remove-client-from-segment');
const recordConversion = require('./creates/record-conversion');

// Searches — combinable with creates via Zapier's "Find or Create"
// toggle so a Zap can resolve-or-make a row in one step.
const findClientByPhone = require('./searches/find-client-by-phone');
const findTemplateByName = require('./searches/find-template-by-name');

module.exports = {
  version: packageJson.version,
  platformVersion,

  authentication,

  flags: {
    cleanInputData: false,
  },

  beforeRequest: [addApiKeyHeader],
  afterResponse: [handleErrors],

  triggers: {
    [messageReceived.key]: messageReceived,
    [messageStatusUpdated.key]: messageStatusUpdated,
    [broadcastCompleted.key]: broadcastCompleted,
    [conversionRecorded.key]: conversionRecorded,
    [clientCreated.key]: clientCreated,
    [getSenders.key]: getSenders,
    [getTemplates.key]: getTemplates,
    [getSegments.key]: getSegments,
    [getClients.key]: getClients,
    [getBroadcasts.key]: getBroadcasts,
  },

  creates: {
    [sendTextMessage.key]: sendTextMessage,
    [sendTemplateMessage.key]: sendTemplateMessage,
    [createBroadcast.key]: createBroadcast,
    [addClient.key]: addClient,
    [updateClient.key]: updateClient,
    [addClientToSegment.key]: addClientToSegment,
    [removeClientFromSegment.key]: removeClientFromSegment,
    [recordConversion.key]: recordConversion,
  },

  searches: {
    [findClientByPhone.key]: findClientByPhone,
    [findTemplateByName.key]: findTemplateByName,
  },
};
