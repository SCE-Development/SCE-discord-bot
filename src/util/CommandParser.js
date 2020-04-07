/**
 * Extract parameters supplied by a user and return them in an array.
 * @param {string} commandString String containing user's commands
 * @returns {Array[string]} Arguments in the command
 */
function parseCommandParameters(commandString) {
  let args = [];
  commandString = commandString.trim();

  while (commandString.length) {
    let arg;
    // check double quotes
    if (commandString.startsWith('"') && commandString.indexOf('"', 1) > 0) {
      arg = commandString.slice(1, commandString.indexOf('"', 1));
      commandString = commandString.slice(commandString.indexOf('"', 1) + 1);
    }
    // check single quotes
    /* eslint-disable */
    else if (commandString.startsWith("'") &&
      commandString.indexOf("'", 1) > 0) {
      arg = commandString.slice(1, commandString.indexOf("'", 1));
      commandString = commandString.slice(commandString.indexOf("'", 1) + 1);
    }
    // check backticks
    /* eslint-enable */
    else if (commandString.startsWith('```') &&
      commandString.indexOf('```', 3) > 0) {
      arg = commandString.slice(3, commandString.indexOf('```', 3));
      commandString = commandString.slice(commandString.indexOf('```', 3) + 3);
    } else {
      arg = commandString.split(/\s+/g)[0].trim();
      commandString = commandString.slice(arg.length);
    }
    args.push(arg.trim());
    commandString = commandString.trim();
  }

  return args;
}

module.exports = { parseCommandParameters };
