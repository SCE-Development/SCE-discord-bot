const Command = require("../Command");

const fetch = require("node-fetch");
const { SCE_API_URL } = require("../../config.json");

module.exports = new Command({
  name: "doorcode",
  description:
    "If someone has difficulty trying to open the door.\
  they can ping the bot and it'll tell them their doorcode.",
  aliases: ["dcode"],
  example: "s!dcode",
  permissions: "admin",
  category: "information",
  disabled: true,
  execute: async (message, args) => {
    let doorCode = "";
    let token = "";

    const author = message.member;
    const userID = author.id;

    // Bot replies to s!doorcode in channel
    message.channel.send("dming you a response!");

    // Get the user's token

    // Get the doorcode from database
    // Post request w/ a JSON body using fetch
    fetch(
      `${SCE_API_URL}/api/DoorCode/getDoorCodeByDiscordID?discordID=${userID}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(token),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        doorCode = data;
      })
      .catch((err) => {
        reject(err);
      });

    // Bot dms user with their doorcode
    author.send("Your doorcode is : " + doorCode);
  },
});
