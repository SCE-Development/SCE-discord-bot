const axios = require('axios');
const ApiResponse = require('./ApiResponses');

let MAINENDPOINTS_API_URL = 'http://localhost:8080/mainendpoints';

const checkID = async IDTest =>{
  let status = new ApiResponse.ApiResponse();
  await axios
    .get(MAINENDPOINTS_API_URL + '/User/checkUserIDTest', {params: {...IDTest}})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });

  return status.responseData;
};

module.exports = {checkID};
