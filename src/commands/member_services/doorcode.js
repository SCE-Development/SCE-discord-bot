const Command = require('../Command');
const { CommandCategory } = require('../../util/enums');


module.exports = new Command({
  name: 'doorcode',
  description: 'If someone has difficulty trying to open the door.\
  they can ping the bot and it\'ll tell them their doorcode.',
  aliases: ['dcode'],
  example: 's!dcode',
  permissions: 'admin',
  category: CommandCategory.INFORMATION,
  disabled: true,
  execute: () => {}
});
