const axios = require('axios');
const { CORE_V4_API_KEY } = require('../../config.json');

let MAINENDPOINTS_API_URL = 'https://sce.engr.sjsu.edu/api/user';
let PERIPHERAL_API_URL = 'https://sce.engr.sjsu.edu/peripheralapi';

/**
 * @summary Calling getUserFromDiscordId endpoint from
 * Core-V4/main_endpoints/User.js to check if user's Discord ID is in database.
 * @param {Number} discordID
 * @return {Promise} A promise that contains a boolean variable of
 * user's discord id validation and number of printed pages
 */
function validateDiscordID(discordID) {
  return new Promise((resolve) => {
    axios
      .post(`${MAINENDPOINTS_API_URL}/getUserFromDiscordId`, {
        discordID,
        apiKey: CORE_V4_API_KEY
      })
      .then((res) => {
        const { pagesPrinted } = res.data;
        const result = {
          isValid: true,
          pagesPrinted: pagesPrinted
        };
        resolve(result);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * @summary Calling healthCheck endpoint from Core-V4/peripheral/Printer.js
 * to check if the printer is in service.
 * @return {Promise} A promise that will return true if printer is in service
 * and vice versa
 *
 */
function printerHealthCheck() {
  return new Promise((resolve) => {
    axios
      .get(`${PERIPHERAL_API_URL}/Printer/healthCheck`)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * @summary Calling pushDiscordPDFToSqs endpoint from
 * Core-V4/peripheral/Printer.js to push the PDF's url to SQS
 * @param {Number} fileURL
 * @return {Promise} A promise.
 *
 */
function pushDiscordPDFToSqs(fileURL) {
  return new Promise((resolve) => {
    axios
      .post(`${PERIPHERAL_API_URL}/Printer/pushDiscordPDFToSqs`, {
        fileURL,
        apiKey: CORE_V4_API_KEY
      })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * @summary Calling updatePagesPrintedFromDiscord endpoint from
 * Core-V4/main_endpoint/User.js to edit user's printed pages
 * @param {String} discordID
 * @param {Number} pagesPrinted
 * @return {Promise} A promise that resolve true if pagesPrinted
 * is successfully updated and vice versa.
 *
 */
function editUserPagesPrinted(discordID, pagesPrinted) {
  return new Promise((resolve) => {
    const body = {
      discordID: discordID,
      apiKey: CORE_V4_API_KEY,
      pagesPrinted: pagesPrinted
    };
    // eslint-disable-next-line max-len
    axios
      .post(`${MAINENDPOINTS_API_URL}/updatePagesPrintedFromDiscord`, body)
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
  pushDiscordPDFToSqs,
  editUserPagesPrinted
};
