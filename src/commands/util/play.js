const { prefix } = require("../../../config.json");

const ytdl = require("ytdl-core");
const play = require("play-dl");

const Command = require("../Command");
const MusicSingleton = require("../../util/MusicSingleton");

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: "play",
  description: "Stream the URL/the most relevant result return from Youtube",
  aliases: ["play"],
  example: `${prefix}play <url/song title>`,
  permissions: "member",
  category: "music",
  disabled: false,
  execute: async (message, args) => {
    const url = args[0];
    const { loop } = message;
    console.log(loop);
    if (ytdl.validateURL(url)) {
      musicHandler.playOrAddYouTubeUrlToQueue(message, url);
    } else {
      if (args[0] === undefined)
        message.reply(`Usage: 
          \`${prefix}search <query>: Returns top 5\`
          \`${prefix}play <title/url>: Plays first song from search/ url\`
          \`${prefix}stream stop/skip: Modifies song playing\`
          
          `);
      else {
        let ytInfo = await play.search(args.join(" "), { limit: 1 });
        if (ytInfo.length > 0) {
          musicHandler.playOrAddYouTubeUrlToQueue(message, ytInfo[0].url);
        } else {
          message.reply(
            `${args.join(" ")} is not a valid YouTube / SoundCloud URL`
          );
        }
      }
    }
  },
});
