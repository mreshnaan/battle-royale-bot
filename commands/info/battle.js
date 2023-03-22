const royalRumble = require("../../gamelogic/rumble");
const { SendMessageToDiscord } = require("../../gamelogic/helper");
const battle = async ({client, message, args}) => {
  const perfixparticipants = [
    { name: "Player 1" },
    { name: "Player 2" },
    { name: "Player 3" },
    { name: "Player 4" },
    { name: "Player 5" },
    { name: "Player 6" },
    { name: "Player 7" },
    { name: "Player 8" },
    { name: "Player 9" },
    { name: "Player 10" },
    { name: "Player 11" },
    { name: "Player 12" },
    { name: "Player 13" },
    { name: "Player 14" },
    { name: "Player 15" },
    { name: "Player 16" },
    { name: "Player 17" },
    { name: "Player 18" },
    { name: "Player 19" },
    { name: "Player 20" },
  ];
  SendMessageToDiscord(
    "Battle Royale",
    `Battle will start in 30 seconds`,
    "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png"
  );
  setTimeout(function () {
    SendMessageToDiscord(
      "Battle Royale",
      `Battle will start in 15 seconds`,
      "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png"
    );
    // message.reply("Battle will start in 15 seconds");
  }, 15000);
  setTimeout(function () {
    SendMessageToDiscord(
      "Started a new Battle Royale session",
      `Number of participants: ${perfixparticipants.length}.`,
      "https://cdn.discordapp.com/attachments/693205078621814864/693584027805810748/badge3.png"
    );
    message.reply("Lets Battle!");
    royalRumble(perfixparticipants);
  }, 30000);
};

const command = {
  name: "battle",
  permissions: [],
  devOnly: false,
  run: battle,
};
module.exports = command;
