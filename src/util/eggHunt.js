const Discord = require('discord.js');
const { pagination } = require('./dataDisplay');
const {
  EASTER_BASKET_QUERY,
  EASTER_EGG_QUERY,
} = require('../APIFunctions/easter');

const startEgghunt = async message => {
  // todo: interactive creation wizard
  // these value need to be set from the user
  const eggID = 'egg id here',
    channel = message.channel,
    period = 30;

  const status = message.client.sceBot.eggHuntClient.addEgg(
    eggID,
    channel,
    period
  );

  switch (status) {
    case 'ok':
      channel
        .send(`Successfully started hunt for ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    case 'dup':
      channel
        .send(`Hunt for ${eggID} in ${channel.name} was already started`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    case 'error':
      channel
        .send(
          `Internal error starting ${eggID} in ${channel.name} ` +
            '(make sure you typed the egg\'s name correctly)'
        )
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    default:
      channel
        .send(`Unknown error starting ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;
  }
};

const stopEgghunt = async message => {
  // todo: interactive creation wizard
  // these value need to be set from the user
  const eggID = 'egg id here',
    channel = message.channel;

  const status = message.client.sceBot.eggHuntClient.stopEgg(eggID, channel);

  switch (status) {
    case 'ok':
      channel
        .send(`Successfully stopped hunt for ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    case 'dne':
      channel
        .send(`There's no hunt for ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    case 'error':
      channel
        .send(`Internal error stopping ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;

    default:
      channel
        .send(`Unknown error stopping ${eggID} in ${channel.name}`)
        .then(msg => msg.delete(10000).catch(() => {}));
      break;
  }
};

async function displayEggs(message, type) {
  const displayEmbed = new Discord.RichEmbed();
  let response;

  switch (type) {
    case 'caught':
      displayEmbed
        .setTitle('How many eggs do you have?')
        .setDescription(
          '1 egg 2 egg red egg blue egg ' + message.member.nickname
        );
      response = await EASTER_BASKET_QUERY({
        guildID: message.guild.id,
        userID: message.member.id,
      });
      break;
    case 'hidden':
      displayEmbed
        .setTitle('Eggs where!?')
        .setDescription('egg there egg here egg in the grassy pear ');
      response = await EASTER_EGG_QUERY({ guildID: message.guild.id });
      break;
    case 'leader':
      displayEmbed.setTitle('Eggs kingdom').setDescription('eggy mceggster ');
      response = await EASTER_BASKET_QUERY({ guildID: message.guild.id });
      break;
  }
  if (response.error) {
    message.channel
      .send('Internal error displaying easter eggs')
      .then(msg => msg.delete(10000).catch(() => {}));
  }

  const items = [];
  for (let i = 0; i < 10; i++) {
    const testInput = {};
    testInput['title'] = 'egg ' + i;
    testInput['field'] = 'EGG!!!!!!!!!!!!!!!';
    items.push(testInput);
  }

  pagination(displayEmbed, message.channel, message.member.id, items);
}

async function createEgg(message) {
  const instructionEmbed = new Discord.RichEmbed()
    .setTitle('Creating an egg!')
    .setDescription(
      'Egg name has to be first\n' +
        'Each step needs to be entered in separate messages.\n' +
        '1. Type in your egg name\n' +
        'OPTIONAL\n' +
        '2. Type "Delay: " then a number for delay between egg spawn. ' +
        '(In milliseconds)\n' +
        '3. Type "URL: " then a discord image URL for egg pic.\n' +
        '4. Type "Code: " then a code so a user can "grab" the egg ' +
        '(Has to be Code or a Delay not both)\n' +
        '5. Type "Description: " then your description.\n' +
        '6. If there is a code add hint by typing "Hint:" then your hint\n' +
        'When finished, type "done"\n'
    );
  message.channel.send(instructionEmbed);

  const filter = m => {
    return m.member.id === message.member.id;
  };
  const messageCollector = message.channel.createMessageCollector(filter, {
    time: 60000,
    errors: ['time'],
  });
  const egg = {
    EggID: undefined,
    Delay: undefined,
    URL: undefined,
    Code: undefined,
    Description: undefined,
    Hint: undefined,
  };
  let infoEmbed;
  const eggIDMessage = async messageIn => {
    console.log(messageIn.content);
    egg.EggID = messageIn.content;
    infoEmbed = new Discord.RichEmbed().setTitle('EggID!')
      .setDescription(`The egg name is \`${egg.EggID}\`. 
            If this is not what you want type 'Stop' and restart.`);
    message.channel.send(infoEmbed);

    const eggSetters = async messageIn => {
      let checker =
        (messageIn.content === 'stop') | (messageIn.content === 'done');
      let messageSeparated;
      let setType;
      let value;
      if (!checker) {
        messageSeparated = /^([a-zA-Z]+)[:](.+)/.exec(messageIn.content);
        setType = messageSeparated[1].toLowerCase();
        value = messageSeparated[2];
      } else {
        setType = messageIn.content.toLowerCase();
      }
      console.log(messageSeparated);
      console.log(setType);
      console.log(value);
      switch (setType) {
        case 'delay':
          value = isNaN(parseInt(value)) ? 30000 : parseInt(value);
          egg.Delay = value;
          infoEmbed.setTitle('Delay Set!');
          if (isNaN(parseInt(messageSeparated[2]))) {
            infoEmbed.setDescription('Error so default delay set to 30000 ms');
          } else {
            infoEmbed.setDescription(`Set to \`${value}\``);
          }
          break;
        case 'url':
          if (
            /^https:[/][/]cdn.discordapp.com[/]attachments[/](.+)/.test(value)
          ) {
            egg.URL = value;
            infoEmbed
              .setDescription('image set to:')
              .setThumbnail(value)
              .setTitle('URL setting');
          } else {
            infoEmbed
              .setDescription(
                'Make sure it is a url that starts with ' +
                  '`https://cdn.discordapp.com/attachments/`\n' +
                  'To get this URL, you upload a pic to discord then right ' +
                  'click on the picture.'
              )
              .setTitle('Error!');
          }
          break;
        case 'code':
          egg.Code = value;
          infoEmbed
            .setTitle('Code setting.')
            .setDescription(`Code set to \`${egg.Code}\``);
          break;
        case 'description':
          egg.Description = value;
          infoEmbed
            .setTitle('Description setting.')
            .setDescription(`description set to \`${egg.Description}\``);
          break;
        case 'hint':
          egg.Hint = value;
          infoEmbed
            .setTitle('Hint setting.')
            .setDescription(`Hint set to \`${egg.Hint}\``);
          break;
        case 'done':
          infoEmbed
            .setTitle('Done')
            .setDescription(
              `egg name is \`${egg.EggID}\`
              Hint set to \`${egg.Hint}\`
              description set to \`${egg.Description}\`
              Code set to \`${egg.Code}\`
              Set to \`${value}\``
            )
            .setThumbnail(egg.URL);
          message.channel.send(infoEmbed);
          messageCollector.stop();
          break;
        case 'stop':
          messageCollector.stop();
          message.channel.send('Process stopped.');
          return;
        default:
          infoEmbed.setTitle('Error').setDescription('not a valid field');
      }
      message.channel.send(infoEmbed);
      infoEmbed.setThumbnail(undefined);
    };
    messageCollector.on('collect', eggSetters);
  };
  messageCollector.once('collect', eggIDMessage);
}

module.exports = {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  createEgg,
};
