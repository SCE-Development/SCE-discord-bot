const { POINT_QUERY, UPDATE_POINT } = require('../APIFunctions/points');
const { POINTS_COOLDOWN_TIME } = require('./constants');

function getWeek() {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function resetPoints(points) {
  const today = new Date();
  const { lastTalked } = points;
  if (today.getFullYear() != lastTalked.getFullYear()) {
    points.weekPoints = 0;
    points.monthPoints = 0;
    points.yearPoints = 0;
  } else if (today.getMonth() != lastTalked.getMonth()) {
    points.weekPoints = 0;
    points.monthPoints = 0;
  } else if (getWeek(today) != getWeek(lastTalked)) {
    points.weekPoints = 0;
  }
}

function addPointsToUser(points) {
  if (!points) {
    points = {
      totalPoints: 0,
      weekPoints: 0,
      monthPoints: 0,
      yearPoints: 0,
    };
  }
  points.totalPoints += 1;
  points.weekPoints += 1;
  points.monthPoints += 1;
  points.yearPoints += 1;
  return points;
}

async function updatePoints(message) {
  const { member, guild } = message;

  const response = await POINT_QUERY({
    guildID: guild.id,
    userID: member.id,
  });
  if (response.error) return;
  let points = response.responseData[0];

  // If no points, add a points object
  if (!points) {
    points = addPointsToUser(points);
    points.guildID = guild.id;
    points.userID = member.id;
    points.lastTalked = new Date();
    points = await UPDATE_POINT(points);
    return points.responseData;
  }

  const lastTalked = new Date(points.lastTalked);
  points.lastTalked = lastTalked;
  const createdAt = new Date(message.createdAt);

  // If last message passed cooldown, add points
  if (createdAt - lastTalked > POINTS_COOLDOWN_TIME) {
    resetPoints(points);
    addPointsToUser(points);
    points.lastTalked = createdAt;
    UPDATE_POINT(points);
  }

  return points;
}

module.exports = { updatePoints, resetPoints };
