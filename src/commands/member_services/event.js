const Command = require('../Command');
const { fetchEvents } = require('../../util/EventFetcher');

/**
 * command that grabs calendar events from SCE server
 * can supply number of events, or 3 by default
 */
module.exports = new Command({
  name: 'event',
  description: 'Displays upcoming events from the SCE calendar.',
  category: 'information',
  aliases: ['events', 'calendar'],
  permissions: 'general',

  execute: (message, args) => {
    const numOfEvents = args[0] || 3;
    fetchEvents(numOfEvents)
      .then((events) => {
        const embed = {
          'title': 'Upcoming SCE Events!',
          'url': 'http://sce.sjsu.edu/',
          'color': 13110653,
          'fields': events,
        };
        message.channel.send({ embed });
      })
      .catch(() => {
        message.channel.send(
          'Couldn\'t fetch any events :upside_down: try again later.'
        );
      });
  },
});

