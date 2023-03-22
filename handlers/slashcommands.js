const { Discord } = require("../utils/imports");
const { display } = require("../utils/functions");
const { botToken, guildId, clientId } = require("../utils/config");
const { fs } = require("../utils/imports");

const slashcommandsHandler = async (bot) => {
  try {
    const { client } = bot;
    let commands = [];
    const slashFiles = fs
      .readdirSync("./slashcommands")
      .filter((file) => file.endsWith(".js"));

    for (const file of slashFiles) {
      const slashcmd = require(`../slashcommands/${file}`);
      client.commands.set(slashcmd.data.name, slashcmd);
      commands.push(slashcmd.data.toJSON());
    }

    const rest = new Discord.REST({ version: "10" }).setToken(botToken);
    display(
      `Deploying slash commands ${commands.length} application (/) commands.`
    );
    rest
      .put(Discord.Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      })
      .then((res) => {
        display(
          `Successfully reloaded ${res.length} application (/) commands.`
        );
      })
      .catch((error) => {
        if (error) {
          display(`${error.message}\ ${__dirname}`, "error");
        }
      });
  } catch (error) {
    display(`${error.message}`, "error");
    console.log(error);
  }
};

module.exports = { slashcommandsHandler };
