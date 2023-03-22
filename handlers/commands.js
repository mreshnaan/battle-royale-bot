const { getFiles, display } = require("../utils/functions");
const { fs } = require("../utils/imports");

const commandsHandler = async (bot, reload) => {
  try {
    const { client } = bot;
    //await to load all the files
    const categories = fs.readdirSync("./commands/");
    //iterate the categories array to get command file names
    for (const category of categories) {
      const commands = getFiles(`./commands/${category}`, ".js");
      if (commands.length >= 1) {
        for (const file of commands) {
          if (!file.endsWith(".js")) {
            console.log(`Skipping ${file} as it's not a .js file`);
            continue;
          }
          if (reload) {
            try {
              delete require.cache[
                require.resolve(`./commands/${category}/${file}`)
              ];
              console.log(`Reloaded command '${file}'`);
            } catch (error) {
              console.log(`Error reloading command file '${file}': ${error}`);
            }
          }
          try {
            const command = require(`../commands/${category}/${file}`);
            client.commands.set(command.name, command);
          } catch (error) {
            console.log(`Error loading command file '${file}': ${error}`);
          }
        }
      }
    }
    display(`Loaded ${client.commands.size} commands`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { commandsHandler };
