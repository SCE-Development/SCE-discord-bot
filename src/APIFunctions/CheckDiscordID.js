const axios = require('axios');
const {ApiResponse} = require('./ApiResponses');

let MAINENDPOINTS_API_URL = 'http://localhost:8080/mainendpoints';

const checkDiscordConnection = async (discordID) =>{
  let status = new ApiResponse();
  await axios
    .get(MAINENDPOINTS_API_URL + '/User/getUserFromDiscordId',
      {params: {...discordID}})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });

  return status.responseData;
};

module.exports = {checkDiscordConnection};
