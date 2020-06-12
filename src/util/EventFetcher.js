const fetch = require('node-fetch');
const { SCE_GOOGLE_API_URL } = require('../../config.json');

const info = ':information_source:';
const calendar = ':calendar_spiral:';
const pushPin = ':round_pushpin';
const clock = ':clock3:';

/**
 * fetches event from SCE API and populates an array of events
 * @param {Number} numOfEvents
 * @returns {Array<String>} fields
 */
function fetchEvents(numOfEvents) {
  return new Promise((resolve, reject) => {
    let eventData = [];
    let fields = [];
    // eslint-disable-next-line
      fetch(`${SCE_GOOGLE_API_URL}/api/mailer/getCalendarEvents?calendarID=primary&numOfEvents=${numOfEvents}`)
      .then(data => data.json())
      .then(data => {
        eventData = data.calendarEvents;
        fields = eventData.map(event => ({
          'name': `${calendar} ${event.summary}`,
          'value': 
                  `${info} \`${event.description || 'No Info'}\` 
                    \n${pushPin} \`${event.location || 'No Location'}\` 
                    \n${clock} \`${event.start.dateTime}\``,
          'inline': true,
        }));
        resolve(fields);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = { fetchEvents };
