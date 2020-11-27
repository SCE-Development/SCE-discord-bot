const Command = require('../Command');

module.exports = new Command({
  name: 'doorcode',
  description: 'If someone has difficulty trying to open the door.\
  they can ping the bot and it\'ll tell them their doorcode.',
  aliases: ['dcode'],
  example: 's!dcode',
  permissions: 'admin',
  category: 'information',
  disabled: true,
  execute: () => {}
});
