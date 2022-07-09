const axios = require('axios');
const {ApiResponse} = require('./ApiResponses');

let PERIPHERAL_API_URL = 'http://localhost:8081/peripheralapi';

async function sendPrintRequest(checkURl){
  let status = new ApiResponse;
  await axios
    .post(PERIPHERAL_API_URL + '/Printer/validateDiscordReq', {...checkURl})
    .then(res => status.responseData = res.data)
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });

  return status;
}

module.exports = {sendPrintRequest};
