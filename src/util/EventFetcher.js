const fetch = require('node-fetch');
const { SCE_API_URL } = require('../../config.json');
const { EVENTS_CAL } = require('../../config.json');

const calendar = ':calendar_spiral:';
const pushPin = ':round_pushpin:';
const clock = ':clock3:';

/**
 * Parses date to a human readable form
 * @param {Date} dateTime 
 */
function parseDate(dateTime) {
  const todaysDate = new Date();
  const days =
    ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  let months =
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const eventDay = days[dateTime.getDay()];
  const eventMonth = months[dateTime.getMonth()];
  if (Math.abs(todaysDate.getDate() - dateTime.getDate()) > 6) {
    return `${clock} ${eventDay} 
            @ ${dateTime.getHours()}:${dateTime.getMinutes}`;
  } else if (todaysDate.getMonth() == dateTime.getMonth()) {
    return `${clock} ${eventDay} the ${dateTime.getDate()} 
            @ ${dateTime.getHours()}:${dateTime.getMinutes}`;
  } else {
    return `${clock} ${eventDay} ${eventMonth}, ${dateTime.getDate()} 
            @ ${dateTime.getHours()}:${dateTime.getMinutes}`;
  }
}

/**
 * Formats the event data into human readable content
 * @param {Object} event 
 */
function formatEventInfo(event) {
  if (!(typeof event.location === 'undefined')) {
    return `${pushPin} ${event.location}\n${parseDate(event.start.dateTime)}`;
  } else {
    return `${parseDate(event.start.dateTime)}`;
  }
}

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
    fetch(`${SCE_API_URL}/cloudapi/Calendar/getCalendarEvents?calendarID=${EVENTS_CAL}&numOfEvents=${numOfEvents}`)
      .then(data => data.json())
      .then(data => {
        eventData = data.calendarEvents;
        fields = eventData.map(event => ({
          'name': `${calendar} ${event.summary}`,
          'value': `${formatEventInfo(event)}`,
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
