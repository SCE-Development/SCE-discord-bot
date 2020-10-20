
const Command = require('../Command');

module.exports = new Command({
  name: 'no-prefix threadmessage',
  regex: new RegExp(/^\|(\d{1,18})\|\s+/),
  description: 'Create or add to a thread with an ID',
  category: 'custom threads',
  permissions: 'general',
  execute: (message) => {
    console.log(
      'Executed Command: <thread message>, message="'
      + message.content
      + '"'
    );
  }
});
