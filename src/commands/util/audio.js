const {
  createAudioPlayer,
} = require('@discordjs/voice');


let audio = {
  upcoming: [],
  history: [],
  player: createAudioPlayer(),
};

let isBotOn = false;

module.exports = {
  getIsBotOn: () => {
    return isBotOn;
  },
  setIsBotOn: (value) => {
    isBotOn = value;
  },
  audio: audio,
};




