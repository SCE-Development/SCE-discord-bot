const Discord = require('discord.js');
const { pagination } = require('./dataDisplay');
const {
  EASTER_BASKET_QUERY,
  EASTER_EGG_QUERY,
  EASTER_EGG_CREATE,
} = require('../APIFunctions/easter');

const startEgghunt = async (eggname, message) => {
  // todo: interactive creation wizard
  // these value need to be set from the user
  const eggID = eggname,
    channel = message.channel,
    period = 30;

  const status = await message.client.sceBot.easterEggHunt.addEgg(
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
  const eggID = 'eggname';
  const channel = message.channel;

  const status = await message.client.sceBot.easterEggHunt.stopEgg(
    eggID,
    channel
  );

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
    case 'basket':
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
    case 'eggs':
      displayEmbed
        .setTitle('Eggs where!?')
        .setDescription('egg there egg here egg in the grassy pear ');
      response = await EASTER_EGG_QUERY({ guildID: message.guild.id });
      break;
    case 'leaderboard':
      displayEmbed.setTitle('Eggs kingdom').setDescription('eggy mceggster ');
      response = await EASTER_BASKET_QUERY({ guildID: message.guild.id });
      break;
  }
  if (response.error) {
    message.channel
      .send('Internal error displaying easter eggs')
      .then(msg => msg.delete(10000).catch(() => {}));
  }

  response =
    type === 'basket' ? response.responseData.egg : response.responseData;
  const items = [];
  if (type === 'leaderboard') {
    for (let i = 0; i < response.length; i++) {
      const inputs = {};
      // initialize all the variables
      const userID = i + 1 + '. ' + response[i]['userID'];
      const description = 'He has ' + response.egg.length + ' eggs.';
      // sorry its messy but initialization done.

      inputs['title'] = userID;
      inputs['field'] = description;
      items.push(inputs);
    }
  } else {
    for (let i = 0; i < response.length; i++) {
      const inputs = {};
      // initialize all the variables
      const eggID = response[i]['eggID'];
      const description =
        response[i]['description'] === null
          ? 'Dude its an egg.'
          : response[i]['description'];
      // sorry its messy but initialization done.

      inputs['title'] = `The eggID is \`${eggID}\``;
      inputs['field'] = description;
      items.push(inputs);
    }
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

  const eggIDMessage = async messageIn => {
    egg.EggID = messageIn.content;
    const infoEmbed = new Discord.RichEmbed().setTitle('EggID!')
      .setDescription(
        `The egg name is \`${egg.EggID}\`. ` +
        'If this is not what you want type "Stop" and restart.'
      );
    message.channel.send(infoEmbed);

    const eggSetters = async messageIn => {
      const checker =
        (messageIn.content === 'stop') | (messageIn.content === 'done');
      let messageSeparated, setType, value;
      if (!checker) {
        messageSeparated = /^([a-zA-Z]+)[:](.+)/.exec(messageIn.content);
        setType = messageSeparated[1].toLowerCase();
        value = messageSeparated[2];
      } else {
        setType = messageIn.content.toLowerCase();
      }

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
          await EASTER_EGG_CREATE({
            guildID: message.guild.id,
            eggID: egg.EggID,
            imageUrl: egg.URL,
            code: egg.Code,
            description: egg.Description,
            hint: egg.Hint,
          });
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

async function gatherEggID(message) {
  const filter = m => {
    return m.member.id === message.member.id;
  };
  const messageCollector = message.channel.createMessageCollector(filter, {
    time: 60000,
    errors: ['time'],
  });

  message.channel.send('What egg are you trying to add? (type in eggID)');
  const response = await EASTER_EGG_QUERY({
    guildID: message.guild.id,
  });
  if (response.error) {
    message.channel.send('Internal error querying eggs')
      .then(msg => msg.delete(10000).catch(() => {}));
  }

  // Show admin what eggs he can add.
  const eggs = response.responseData;
  if (!eggs) {
    message.channel.send('Make an egg first!');
    return;
  }
  const items = [];
  for (let i = 0; i < eggs.length; i++) {
    const inputs = {};
    // initialize all the variables
    const eggID = eggs[i]['eggID'];
    const imageURL =
      eggs[i]['imageUrl'] === null
        ? 'there is no image'
        : 'There is an image!';
    const code =
      eggs[i]['code'] === null ? 'no code' : eggs[i]['code'];
    const description =
      eggs[i]['description'] === null
        ? 'no description'
        : eggs[i]['description'];
    const hint =
      eggs[i]['hint'] === null ? 'no hint' : eggs[i]['hint'];
    // sorry its messy but initialization done.

    inputs['title'] = `The eggID is \`${eggID}\``;
    inputs['field'] = `imageURL: ${imageURL}
    code: ${code}
    description: ${description}
    hint: ${hint}`;
    items.push(inputs);
  }
  const displayEmbed = new Discord.RichEmbed()
    .setTitle('All eggs to choose from')
    .setDescription('');
  pagination(displayEmbed, message.channel, message.author.id, items, 3);
  // make message collector
  const getEggID = async messageIn => {
    const queryCheck = await EASTER_EGG_QUERY({
      guildID: message.guild.id,
      eggID: messageIn.content,
    });
    if (queryCheck.responseData.length) {
      startEgghunt(messageIn.content, message);
    } else {
      message.channel.send('No such egg.');
    }
  };
  messageCollector.once('collect', getEggID);
}
module.exports = {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  createEgg,
  gatherEggID,
};
