const ready = async (bot) => {
  console.log("Logged in as " + bot.client.user.tag);
};

const event = {
  name: "ready",
  run: ready,
};

module.exports = event;
