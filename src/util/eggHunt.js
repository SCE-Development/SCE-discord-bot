const Discord = require('discord.js');
const { EasterEgg } = require('./easterEgg');
const { pagination } = require('./dataDisplay');
const {
  EASTER_BASKET_QUERY,
  EASTER_EGG_QUERY,
} = require('../APIFunctions/easter');
const runningIntervals = {};

function startEgghunt(channelName, guild) {
  if (guild === undefined) return;
  if (!guild.available) return;
  let channel = guild.channels.find(channel => channel.name === channelName);
  if (!channel) return;
  runningIntervals[channelName] = new EasterEgg(20000, channel, guild);
  runningIntervals[channelName].start();
}

function stopEgghunt(guild, channelName) {
  if (guild === undefined) return;
  if (!guild.available) return;
  console.log(channelName);
  if (channelName !== undefined) {
    runningIntervals[channelName].stop();
    delete runningIntervals[channelName];
  } else {
    for (const channelName in runningIntervals) {
      if (runningIntervals[channelName] != undefined) {
        console.log(channelName);
        runningIntervals[channelName].stop();
        delete runningIntervals[channelName];
      }
    }
  }
}

async function displayEggs(userID, guildID, channel, type) {
  if (type === undefined) return;
  let templateEmbed = new Discord.RichEmbed();
  let Query;
  switch (type) {
    case 'caught':
      templateEmbed
        .setTitle('How many eggs do you have?')
        .setDescription('1 egg 2 egg red egg blue egg ' + userID);
      Query = await EASTER_BASKET_QUERY({
        guildID: guildID,
        userID: userID,
      });
      break;
    case 'hidden':
      templateEmbed
        .setTitle('Eggs where!?')
        .setDescription('egg there egg here egg in the grassy pear ' + guildID);
      Query = await EASTER_EGG_QUERY({ guildID: guildID });
      break;
    case 'leader':
      templateEmbed
        .setTitle('Eggs kingdom')
        .setDescription('eggy mceggster ' + guildID);
      Query = await EASTER_BASKET_QUERY({ guildID: guildID });
      break;
  }
  let items = [];
  console.log(Query);
  for (let i = 0; i < 10; i++) {
    let testInput = {};
    testInput['title'] = 'egg' + i;
    testInput['field'] = 'EGG!!!!!!!!!!!!!!!';
    items.push(testInput);
  }
  pagination(templateEmbed, channel, userID, items);
}

async function CreateEgg(channel, userID) {
  let instructionEmbed = new Discord.RichEmbed()
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
  channel.send(instructionEmbed);

  const filter = m => {
    console.log(m.author.id === userID);
    return m.author.id === userID;
  };
  const messageCollector = channel.createMessageCollector(filter, {
    time: 60000,
    errors: ['time'],
  });
  let egg = {
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
    channel.send(infoEmbed);

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
          channel.send(infoEmbed);
          messageCollector.stop();
          break;
        case 'stop':
          messageCollector.stop();
          channel.send('Process stopped.');
          return;
        default:
          infoEmbed.setTitle('Error').setDescription('not a valid field');
      }
      channel.send(infoEmbed);
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
  CreateEgg,
};
