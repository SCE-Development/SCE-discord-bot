
// implement: reset/cooldown
/*
1. MessageHandler calls points(message)
Inside function points(message)
2. Query the user to get their points data
3. Using last talked, update the points object for week, month, year
4. check if they're on cooldown and update points accordingly
5. Mutation to update the database with the your points object (create a new object if the user is not in the db already)
*/
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
  const points = response.responseData;
  // If last message passed cooldown, add points
  if (message.createdAt - points.lastTalked > c) {
    points.weekPoints += p;
    points.monthPoints += p;
    points.yearPoints += p;
    points.totalPoints += p;
    ADD_POINTS(points);
  }
  // If talking past week/month/year lines, reset that
  // point set to 0, then add points
}

module.exports = { increment }