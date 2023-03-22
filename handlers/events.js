const { getFiles, display } = require("../utils/functions");

const triggerEventHandler = (bot, event, ...args) => {
  try {
    const { client } = bot;
    if (client.events.has(event)) {
      client.events.get(event).run(bot, ...args);
    } else {
      throw new Error(`Event ${event} does not exist`);
    }
  } catch (error) {
    console.error(error);
  }
};

const initEvents = (bot) => {
  const { client } = bot;
  client.on("ready", () => {
    triggerEventHandler(bot, "ready");
  });
  client.on("messageCreate", (message) => {
    triggerEventHandler(bot, "messageCreate", message);
  });
  client.on("interactionCreate", (interaction) => {
    triggerEventHandler(bot, "interactionCreate", interaction);
  });
};

const eventsHandler = (bot, reload) => {
  const { client } = bot;

  const events = getFiles("./events/", ".js");
  //length is 0 then console log
  if (!events.length) {
    console.log("No events to load");
    return;
  }
  for (const file of events) {
    if (reload) {
      delete require.cache[require.resolve(`../events/${file}`)];
    }
    const event = require(`../events/${file}`);
    client.events.set(event.name, event);
    if (!reload) {
      // display(`[EVENT] ${event.name} loaded`);
      display(`${events.indexOf(file) + 1}. ${file} loaded`);

    }
  }
  if (!reload) {
    initEvents(bot);
  }
};

module.exports = { eventsHandler };
