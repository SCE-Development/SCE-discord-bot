const { request, gql } = require('graphql-request');
const { url } = require('../../config.json');

const THREAD_QUERY = async () => {
  const query = gql`
  {
    threadMany {
      threadID
      creatorID
      guildID
      topic
      messages {
        messageID
        position
      }
    }
  }
  `;
  let response = {};
  await request(`${url}/graphql`, query)
    .then((data) => {
      response.data = data;
      response.error = false;
    })
    .catch(() => {
      response.data = {};
      response.error = true;
    });
  return response;
};

module.exports = {
  THREAD_QUERY
};
