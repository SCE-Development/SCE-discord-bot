const nonPrefixCommandsPath = '../nonPrefixCommands';

const Command = require(nonPrefixCommandsPath + '/Command');

const requireDir = require('require-dir');

/**
 * Generates a regular expression that matches all the non-prefix commands.
 * @returns {RegExp} Regular expression matching all non-prefix commands.
 */
function createNonPrefixRegex() {
  let regExp = '';
  const commandFiles = requireDir(nonPrefixCommandsPath, { recurse: true });

  for (const directory in commandFiles) {
    for (const file in commandFiles[directory]) {
      const command = require(`${nonPrefixCommandsPath}/${directory}/${file}`);
      if (command instanceof Command) {
        regExp += `|(${command.regex.source})`;
      }
    }
  }
  regExp = regExp.slice(1);

  return new RegExp(regExp);
}

module.exports = { createNonPrefixRegex };
