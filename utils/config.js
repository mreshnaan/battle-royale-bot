const dotenv = require("dotenv");
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const CLIENT_ID = process.env.CLIENT_ID || "";
// 1080723910565306419  1077189692182757406
const CHANNELID = process.env.CHANNELID || "";
//    1027655504429846609 1077189600004546634
const GUILD_ID = process.env.GUILD_ID || "";
const WELCOME_CHANNELID = process.env.WELCOME_CHANNELID || "";
const TIMER_TO_START_THE_GAME = process.env.TIMER_TO_START_THE_GAME || "";

const SERVER = {
  botToken: BOT_TOKEN,
  clientId: CLIENT_ID,
  channelId: CHANNELID,
  guildId: GUILD_ID,
  welcomeChannelId: WELCOME_CHANNELID,
  startGame: TIMER_TO_START_THE_GAME,
};
module.exports = SERVER;
