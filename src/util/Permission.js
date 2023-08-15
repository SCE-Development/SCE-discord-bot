function isOfficer(user) {
  try {
    return (
      user.permissions.has('MANAGE_CHANNELS') ||
      user.permissions.has('ADMINISTRATOR')
    );
  } catch (error) {
    return false;
  }
}

function isAdmin(user) {
  return user.permissions.has('ADMINISTRATOR');
}

module.exports = { isOfficer, isAdmin };
