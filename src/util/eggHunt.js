const Discord = require('discord.js');
const { sendMessageAndDelete, deleteMessage, getInput } = require('./messages');
const PaginatedMessage = require('../components/PaginatedMessage');
const {
  EASTER_BASKET_QUERY,
  EASTER_EGG_QUERY,
  EASTER_EGG_CREATE,
} = require('../APIFunctions/easter');
const { MED_WAIT, LONG_WAIT } = require('./constants');

const startEgghunt = async message => {
  const display = new Discord.RichEmbed().setTitle(
    'Egg Hunt: Start an egg channel'
  );
  let prompt, response;

  const cancel = () => {
    deleteMessage(prompt);
    sendMessageAndDelete(message.channel, 'Canceled starting egg channel');
  };

  // eggID
  display.setDescription('Enter an Egg ID');
  prompt = await message.channel.send(display);

  try {
    response = await getInput(message.channel, message.member);
  } catch (e) {
    cancel();
    return;
  }

  const eggID = response.content.trim().toLowerCase();
  deleteMessage(response);
  deleteMessage(prompt);

  // channel
  display.setDescription(
    `Tag the target channel like this: ${message.channel}`
  );
  prompt = await message.channel.send(display);

  try {
    response = await getInput(message.channel, message.member);
  } catch (e) {
    cancel();
    return;
  }

  if (response.mentions.channels.size !== 1) {
    cancel();
    return;
  }

  const channel = response.mentions.channels.array()[0];
  deleteMessage(response);
  deleteMessage(prompt);

  // period
  display.setDescription(
    'Enter the average time between egg spawns in minutes ' +
      '(or anything to default to 30 minutes)'
  );
  prompt = await message.channel.send(display);

  try {
    response = await getInput(message.channel, message.member);
  } catch (e) {
    cancel();
    return;
  }

  let period = response.content.trim();
  if (isNaN(period)) {
    period = 30;
  } else {
    period = parseInt(period);
  }
  deleteMessage(response);
  deleteMessage(prompt);

  const status = await message.client.sceBot.easterEggHunt.addEgg(
    eggID,
    channel,
    period
  );

  switch (status) {
    case 'ok':
      sendMessageAndDelete(
        message.channel,
        `Successfully started hunt for ${eggID} in ${channel}`
      );
      break;

    case 'dup':
      sendMessageAndDelete(
        message.channel,
        `Hunt for ${eggID} in ${channel} was already started`
      );
      break;

    case 'error':
      sendMessageAndDelete(
        message.channel,
        `Internal error starting ${eggID} in ${channel} ` +
          '(make sure you typed the egg name correctly)'
      );
      break;

    default:
      sendMessageAndDelete(
        message.channel,
        `Unknown error starting ${eggID} in ${channel}`
      );
      break;
  }
};

const stopEgghunt = async message => {
  const display = new Discord.RichEmbed().setTitle(
    'Egg Hunt: Stop an egg channel'
  );
  let prompt, response;

  const cancel = () => {
    deleteMessage(prompt);
    sendMessageAndDelete(message.channel, 'Canceled stopping egg channel');
  };

  // eggID
  display.setDescription('Enter an Egg ID');
  prompt = await message.channel.send(display);

  try {
    response = await getInput(message.channel, message.member);
  } catch (e) {
    cancel();
    return;
  }

  const eggID = response.content.trim().toLowerCase();
  deleteMessage(response);
  deleteMessage(prompt);

  // channel
  display.setDescription(
    `Tag the target channel like this: ${message.channel}`
  );
  prompt = await message.channel.send(display);

  try {
    response = await getInput(message.channel, message.member);
  } catch (e) {
    cancel();
    return;
  }

  if (response.mentions.channels.size !== 1) {
    cancel();
    return;
  }

  const channel = response.mentions.channels.array()[0];
  deleteMessage(response);
  deleteMessage(prompt);

  const status = await message.client.sceBot.easterEggHunt.stopEgg(
    eggID,
    channel
  );

  switch (status) {
    case 'ok':
      sendMessageAndDelete(
        message.channel,
        `Successfully stopped hunt for ${eggID} in ${channel}`
      );
      break;

    case 'dne':
      sendMessageAndDelete(
        message.channel,
        `There's no hunt for ${eggID} in ${channel}`
      );
      break;

    case 'error':
      sendMessageAndDelete(
        message.channel,
        `Internal error stopping ${eggID} in ${channel}`
      );
      break;

    default:
      sendMessageAndDelete(
        message.channel,
        `Unknown error stopping ${eggID} in ${channel}`
      );
      break;
  }
};

async function displayEggs(message, mode) {
  const displayEmbed = new Discord.RichEmbed();
  let response;

  switch (mode) {
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
    sendMessageAndDelete(
      message.channel,
      'Internal error displaying easter eggs'
    );
  }

  response =
    mode === 'basket' ? response.responseData.egg : response.responseData;
  const items = [];
  if (mode === 'leaderboard') {
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

  const pages = new PaginatedMessage(message.channel, message.member, items, {
    templateEmbed: displayEmbed,
    keepAlive: MED_WAIT,
  });
  pages.send();
}

async function createEgg(message) {
  const instructionEmbed = new Discord.RichEmbed()
    .setTitle('Creating an egg!')
    .setDescription(
      'Egg name has to be first\n' +
        'Each step needs to be entered in separate messages.\n' +
        '1. Type in your egg name\n' +
        'OPTIONAL\n' +
        '2. Type "URL: " then a discord image URL for egg pic.\n' +
        '3. Type "Code: " then a code so a user can "grab" the egg ' +
        '(Has to be Code or a Delay not both)\n' +
        '4. Type "Description: " then your description.\n' +
        '5. If there is a code add hint by typing "Hint:" then your hint\n' +
        'When finished, type "done"\n'
    );
  message.channel.send(instructionEmbed);

  const filter = m => {
    return m.member.id === message.member.id;
  };
  const messageCollector = message.channel.createMessageCollector(filter, {
    time: MED_WAIT,
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
    const infoEmbed = new Discord.RichEmbed()
      .setTitle('EggID!')
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
    time: LONG_WAIT,
    errors: ['time'],
  });

  const prompt = await message.channel.send(
    'What egg are you trying to add? (type in eggID)'
  );

  const response = await EASTER_EGG_QUERY({
    guildID: message.guild.id,
  });
  if (response.error) {
    sendMessageAndDelete(message.channel, 'Internal error querying eggs');
    return null;
  }

  // Show admin what eggs he can add.
  const eggs = response.responseData;
  if (!eggs) {
    sendMessageAndDelete(message.channel, 'Make an egg first!');
    return;
  }
  const items = [];
  for (let i = 0; i < eggs.length; i++) {
    const inputs = {};
    // initialize all the variables
    const eggID = eggs[i]['eggID'];
    const imageURL =
      eggs[i]['imageUrl'] === null ? 'there is no image' : 'There is an image!';
    const code = eggs[i]['code'] === null ? 'no code' : eggs[i]['code'];
    const description =
      eggs[i]['description'] === null
        ? 'no description'
        : eggs[i]['description'];
    const hint = eggs[i]['hint'] === null ? 'no hint' : eggs[i]['hint'];
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
  const pages = new PaginatedMessage(message.channel, message.member, items, {
    templateEmbed: displayEmbed,
    itemsPerPage: 3,
  });
  pages.send();
  // make message collector
  const getEggID = async messageIn => {
    const queryCheck = await EASTER_EGG_QUERY({
      guildID: message.guild.id,
      eggID: messageIn.content,
    });
    if (queryCheck.responseData.length) {
      startEgghunt(messageIn.content, message);
    } else {
      sendMessageAndDelete(message.channel, 'No such egg');
    }
  };
  messageCollector.once('collect', getEggID);
}
module.exports = {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  createEgg,
};
