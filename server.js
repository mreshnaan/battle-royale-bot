const { Discord, client } = require("./utils/imports");
const { eventsHandler } = require("./handlers/events");
const { commandsHandler } = require("./handlers/commands");
const { slashcommandsHandler } = require("./handlers/slashcommands");
const config = require("./utils/config");

let bot = {
  client,
  prefix: "!",
  owner: ["899375613532594227"],
};
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.loadEvents = (bot, reload) => eventsHandler(bot, reload);
client.loadCommands = (bot, reload) => commandsHandler(bot, reload);
client.loadSlashCommands = (bot) => slashcommandsHandler(bot);
client.loadEvents(bot, false);
client.loadCommands(bot, false);
client.loadSlashCommands(bot)
module.exports = bot;

client.login(config.botToken);
