const Discord = require('discord.js');
const { MessageHandler } = require('./handlers/MessageHandler');
const {
  VoiceChannelChangeHandler,
} = require('./handlers/VoiceChannelChangeHandler');
const { NewMemberAddHandler } = require('./handlers/NewMemberAddHandler');
const { EggHuntClient } = require('./util/eggHuntClient');

class SceBot {
  constructor(args) {
    this.API_TOKEN = args.API_TOKEN;
    this.prefix = args.prefix;
    this.client = new Discord.Client();
    this.messageHandler = new MessageHandler({ sceBot: this });
    this.vcChangeHandler = new VoiceChannelChangeHandler();
    this.newMemberHandler = new NewMemberAddHandler();
    this.easterEggHunt = new EggHuntClient({ sceBot: this });
  }

  initialize() {
    this.client.once('ready', () => {
      this.messageHandler.initialize();
      this.client.user.setPresence({
        game: {
          name: `${this.prefix}help`,
          type: 'LISTENING',
        },
      });
      console.log('Discord bot live');
    });

    this.client.on('message', message => {
      this.messageHandler.handleMessage(message);
    });

    this.client.on('voiceStateUpdate', (oldMember, newMember) => {
      this.vcChangeHandler.handleChangeMemberInVoiceChannel(
        oldMember,
        newMember
      );
    });

    this.client.on('guildMemberAdd', newMember => {
      this.newMemberHandler.handleNewMember(newMember);
    });

    this.client.login(this.API_TOKEN);
  }
}

module.exports = { SceBot };
