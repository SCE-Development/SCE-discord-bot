const { prefix } = require('../../../config.json');

const Command = require('../Command');

const audioManager = require('../../util/audioManager');

module.exports = new Command({
  name: 'resume',
  description: 'Resume the paused track',
  aliases: ['resume'],
  example: `${prefix}resume`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    audioManager.getAudioPlayer().unpause();
    return message.reply('Resumed!')
  },
});
