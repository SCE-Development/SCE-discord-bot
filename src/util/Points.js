const { POINTS_QUERY, UPDATE_POINTS,
  POINTS_COOLDOWN_TIME } = require('../APIFunctions/points.js');

// Points to be added, between 25 and 50
let p = Math.floor(Math.random() * (50 - 25) + 25);

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

function addPointsToUser(points) {
  if (!points) {
    points = {
      totalPoints: p,
      weekPoints: p,
      monthPoints: p,
      yearPoints: p
    };
  }
  points.totalPoints += p;
  points.weekPoints += p;
  points.monthPoints += p;
  points.yearPoints += p;
  return points;
}

async function updatePoints(message) {
  const author = message.author;
  const guild = message.guild;
  // When a message is sent, query the user points
  const response = await POINTS_QUERY({
    guildID: guild.id,
    userID: author.id
  });
  if (response.error)
    return;
  let points = response.responseData[0];
  // If no points, add a points object
  if (!points) {
    points = {
      guildID: guild.id,
      userID: author.id,
    };
    points = addPointsToUser(points);
    points.lastTalked = new Date();
    points = await UPDATE_POINTS(points);
    return points.responseData;
  }

  let lastTalked = points.lastTalked;
  let createdAt = message.createdAt;
  points.lastTalked = new Date(points.lastTalked);

  // If last message passed cooldown, add points
  if (createdAt - lastTalked > POINTS_COOLDOWN_TIME) {
    resetPoints(points);
    addPointsToUser(points);
    points.lastTalked = message.createdAt;
    points = await UPDATE_POINTS(points);
  }
  return points.responseData;
}

module.exports = { updatePoints, resetPoints };
