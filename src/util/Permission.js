function isOfficer(user) {
  return (
    user.permissions.has('MANAGE_CHANNELS') ||
    user.permissions.has('ADMINISTRATOR')
  );
}

function isAdmin(user) {
  return user.permissions.has('ADMINISTRATOR');
}

module.exports = { isOfficer, isAdmin };
