const session = require('express-session');
const Keycloak = require('keycloak-connect');

const REALM_ADMIN_ROLE = process.env.CH_REALM_ADMIN_ROLE || 'app-admin';
const REALM_SUPER_ADMIN_ROLE = process.env.CH_REALM_SUPER_ADMIN_ROLE || 'app-super-admin';

const kcConfig = {
  clientId: process.env.AUTH_CLIENT_ID || 'cohotz-service',
  bearerOnly: true,
  serverUrl: process.env.AUTH_SERVER || 'https://auth.cohotz.com',
  realm: process.env.AUTH_REALM || 'cohotz'
};
const memoryStore = new session.MemoryStore();




Keycloak.prototype.accessDenied = function (request, response) {
  response.status(401)
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify({ status: 401, message: 'Unauthorized/Forbidden', result: { errorCode: 'CH-ERR-401', errorMessage: 'Unauthorized/Forbidden' } }))
}

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);


function adminOnly(token, request) {
  return token.hasRole(`realm:${REALM_SUPER_ADMIN_ROLE}`) || token.hasRole(`realm:${REALM_ADMIN_ROLE}`);
}

function superAdminOnly(token, request) {
  return token.hasRole(`realm:${REALM_SUPER_ADMIN_ROLE}`);
}

module.exports = {
  keycloak,
  memoryStore,
  adminOnly,
  superAdminOnly
};