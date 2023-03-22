const handleButton = (bot, interaction) => {
  const { client } = bot;

  // "name-param1-param2-...."
  const [name, ...params] = interaction.customId.split("-");

  const button = client.buttons.get(name);

  if (!button) return;
  button.run(client, interaction, params);
};

const handleSlashCommand = async (bot, interaction) => {
  const { client } = bot;
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a guild");

  const slashcmd = client.commands.get(interaction.commandName);

  console.log("Slash command ==>", slashcmd);

  if (!slashcmd) return;

  // // Check if the user has the permission role
  // if (!interaction.member.roles.cache.find((r) => r.name === "Moderator")) {
  //   await interaction.reply("You do not have permission to use this command.");
  //   return;
  // }

  // check permissions
  if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perms))
    return interaction.reply("You do not have permission to use this command");

  slashcmd.run(client, interaction);
};

module.exports = {
  name: "interactionCreate",
  run: async (bot, interaction) => {
    if (interaction.isCommand()) {
      handleSlashCommand(bot, interaction);
    } else if (interaction.isButton()) {
      handleButton(bot, interaction);
    }
  },
};
