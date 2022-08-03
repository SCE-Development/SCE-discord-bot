const Command = require("../Command");

const fetch = require("node-fetch");
const { SCE_API_URL } = require("../../../config.json");

module.exports = new Command({
  name: "doorcode",
  description:
    "If someone has difficulty trying to open the door.\
  they can ping the bot and it'll tell them their doorcode.",
  aliases: ["dcode"],
  example: "s!dcode",
  permissions: "admin",
  category: "information",
  disabled: false,
  execute: (message, args) => {
    const author = message.member;
    const userID = author.id;

    let { isValid } = validateDiscordID(message.author);
    if (!isValid) {
      return message.channel.send(
        "Connect your discord account with " + "SCE web then try again!"
      );
    }

    // Bot replies to s!doorcode in channel
    message.channel.send("dming you a response!");

    // Get the user's token
    fetch(`${SCE_API_URL}/api/Auth/getTokenFromDiscordID?discordID=${userID}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const token = data.token;
        if (token == undefined) {
          author.send("Sorry, your discord ID is not in the database.");
        } else {
          // Get the doorcode from database
          // Post request w/ a JSON body containing token using fetch
          fetch(
            `${SCE_API_URL}/api/DoorCode/getDoorCodeByDiscordID?discordID=${userID}`,
            {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({
                token: token,
              }),
            }
          )
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              author
                .send("Your doorcode is: " + data.code)
                .catch(console.error);
            })
            .catch((err) => {
              console.log(err);
              author.send(
                "Sorry, either your doorcode is not in the database, or you are not an officer or higher."
              );
            });
        }
      })
      .catch((err) => {
        author.send("Sorry, your discord ID is not in the database");
      });
  },
});
