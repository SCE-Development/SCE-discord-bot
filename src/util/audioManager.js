let audioPlayer = null;
let connection = null;
let videoInfo = null;
let vidUrl = null;

module.exports = {
  getAudioPlayer: () => audioPlayer,
  setAudioPlayer: (player) => {
    audioPlayer = player;
  },
  getConnection: () => connection,
  setConnection: (conn) => {
    connection = conn;
  },
  getInfo: () => videoInfo,
  setInfo: (info) => {
    videoInfo = info;
  },
  getUrl: () => vidUrl,
  setUrl: (url) => {
    vidUrl = url;
  }
};
