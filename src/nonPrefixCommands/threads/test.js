
const Command = require('../Command');

module.exports = new Command({
  name: 'no-prefix test',
  regex: new RegExp(/^test\s+/),
  description: 'Test command to test non-prefix commands',
  category: 'custom threads',
  permissions: 'general',
  execute: (message) => {
    console.log('Executed Command: <test>, message="'
      + message.content
      + '"'
    );
  }
});
