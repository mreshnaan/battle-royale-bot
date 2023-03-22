const Discord = require("discord.js");
const fs = require("fs");
const colors = require("colors");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.MessageContent
  ],
});

module.exports = {
  Discord,
  fs,
  client,
  colors,
};
