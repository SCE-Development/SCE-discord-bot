const axios = require('axios');
const ApiResponse = require('./ApiResponses');

let PERIPHERAL_API_URL = 'http://localhost:8081/peripheralapi';

async function allowPrinting(url){
  let status = new ApiResponse.ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Printer/addFilePDF', {...url})
    .then(res => status.responseData = res.data)
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });

  return status.responseData;
}

module.exports = {allowPrinting};
