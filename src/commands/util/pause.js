const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
    name: 'pause',
    description: 'Pause the track',
    aliases: ['pause'],
    example: 's!pause',
    permissions: 'member',
    category: 'information',
    disabled: false,
    execute: async (message, args) => {
        if (message.member.voice.channel) {
            if (args[0] === undefined) {
                musicHandler.pause(message, 1);
            } else {
                message.reply('Invalid Option');
            }
        } else {
            message.reply('Please join voice channel first!');
        }
    },
});
