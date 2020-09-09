const { officerRole } = require('../../config.json');

function isOfficer(user) {
  return (user.permissions.has('MANAGE_CHANNELS') ||
    user.permissions.has('ADMINISTRATOR') ||
    user.roles.get(officerRole));
}

function isAdmin(user) {
  return (user.permissions.has('ADMINISTRATOR') ||
    user.roles.get(officerRole));
}

module.exports = { isOfficer, isAdmin };
