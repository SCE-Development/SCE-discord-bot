const { POINTS_QUERY, UPDATE_POINTS } = require('../APIFunctions/points.js');

function getWeek() {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function resetPoints(points) {
  const today = new Date();
  const lastTalked = points.lastTalked;
  if ((today.getFullYear() != lastTalked.getFullYear())
    || (today.getDate() != lastTalked.getDate())) {
    if ((today.getFullYear() != lastTalked.getFullYear())) {
      points.weekPoints = 0;
      points.monthPoints = 0;
      points.yearPoints = 0;
    }
    else if (today.getMonth() != lastTalked.getMonth()) {
      points.weekPoints = 0;
      points.monthPoints = 0;
    }
    else if (getWeek(today) != getWeek(lastTalked)) {
      points.weekPoints = 0;
    }
  }
}

async function increment(message) {
  // Random point value to add
  let p = Math.floor(Math.random() * (50 - 25) + 25);
  // Cooldown time in ms
  let c = 180000;
  const author = message.author;
  const guild = message.guild;
  // When a message is sent, query the user points
  const response = await POINTS_QUERY({
    guildID: message.guild.id,
    userID: author.id
  });
  if (response.error)
    return;
  let points = response.responseData;
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
    points = await UPDATE_POINTS(points);
    return points.responseData;
  }

  points.lastTalked = new Date(points.lastTalked);
  let lastTalked = points.lastTalked;
  let createdAt = message.createdAt;

  // If last message passed cooldown, add points
  if (createdAt - lastTalked > c) {
    resetPoints(points);
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    points.lastTalked = message.createdAt;
    points = await UPDATE_POINTS(points);
  }
  return points.responseData;
}

module.exports = { increment, resetPoints };
