const { POINTS_QUERY, ADD_POINTS } = require('../APIFunctions/points.js');

async function increment(message) {
  // Random point value to add
  let p = Math.floor(Math.random() * (50 - 25) + 25);
  // Cooldown time in ms
  let c = 1000;
  const author = message.author;
  const guild = message.guild;
  // When a message is sent, query the user points
  const response = await POINTS_QUERY(message);
  if (response.error)
    return;
  let points = response.responseData;
  console.log(response);
  // If no points, add a points object
  if (!points) {
    points = {
      guildID: guild.id,
      userID: author.id,
      weekPoints: p,
      monthPoints: p,
      yearPoints: p,
      totalPoints: p,
      lastTalked: new Date()
    };
    ADD_POINTS(points);
  }
  // If last message passed cooldown, add points
  else if (message.createdAt - new Date(points.lastTalked) > c) {
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    ADD_POINTS(points);
  }
  // If day of week is Monday, set weekPoints to 0, then add
  else if (getDay(message.createdAt) == 0) {
    points.weekPoints = 0;
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    ADD_POINTS(points);
  }
  // If 1st day of month, set monthPoints to 0, then add
  else if (getDate(message.createdAt) == 1) {
    points.monthPoints = 0;
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    ADD_POINTS(points);
  }
  // If Jan 1, set yearPoints to 0, then add
  else if (getDate(message.createdAt) == 1
    && getMonth(message.createdAt) == 0) {
    points.yearPoints = 0;
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    ADD_POINTS(points);
  }
}

module.exports = { increment }