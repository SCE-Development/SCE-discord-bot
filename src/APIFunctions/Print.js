const axios = require('axios');
const { CORE_V4_API_KEY } = require('../../config.json');

let MAINENDPOINTS_API_URL = 'http://localhost:8080/mainendpoints/User';
let PERIPHERAL_API_URL = 'http://localhost:8081/peripheralapi';

function validateDiscordID(discordID) {
  return new Promise((resolve) => {
    // eslint-disable-next-line max-len
    axios.get(`${MAINENDPOINTS_API_URL}/getUserFromDiscordId?discordID=${discordID}&apiKey=${CORE_V4_API_KEY}`)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

function printerHealthCheck() {
  return new Promise((resolve) => {
    axios.get(`${PERIPHERAL_API_URL}/Printer/healthCheck`)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

function pushDiscordPDFToSqs(fileURL) {
  return new Promise((resolve) => {
    axios.post(`${PERIPHERAL_API_URL}/Printer/pushDiscordPDFToSqs`,
      { fileURL, CORE_V4_API_KEY })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

module.exports = {
  validateDiscordID,
  printerHealthCheck,
  pushDiscordPDFToSqs
};
