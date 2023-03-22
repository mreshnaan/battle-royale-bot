//imports
const { Discord, client } = require("../utils/imports");
const config = require("../utils/config");
const {
  SendParticipateMessage,
  SendTimerMessageToParticipants,
  SendTimerMessageToStartBattle,
  SendTeamSelectMessage,
  SendUserMessage,
  ErrorMessages,
} = require("../utils/constant");
const { PARTICIPANT_EMOJI, TEAM_SELECT_EMOJI } = require("../utils/gameConfig");
const royalRumble = require("../gamelogic/rumble");
const {
  SendMessageToDiscord,
  EraMessage,
  countDown,
  perRoundCountDown,
  convertMillisecondsToMinutes,
  sendTimedMessageToDiscord,
} = require("../gamelogic/helper");

let gameIsRunning = false;
const battle = async (bot, interaction) => {
  // Define a command handler for the "battle" command
  if (interaction.isCommand() && interaction.commandName === "battle") {
    //check if command runs on the given respective channel
    if (interaction.channelId !== config.channelId) {
      //https://stackoverflow.com/questions/69805973/send-an-ephemeral-message-to-person-who-clicked-button
      return interaction.followUp({
        content: `${ErrorMessages.COMMAND_PERMISSION} <#${config.channelId}>.`,
        ephemeral: true,
      });
    }
    //check if the game already in process or start
    if (gameIsRunning) {
      console.log(
        "The game is already running. Please wait until it finishes."
      );
      return interaction.followUp({
        content: `${ErrorMessages.GAME_START}`,
        ephemeral: true,
      });
    }

    gameIsRunning = true;

    // assume interaction is an instance of Interaction
    const eraType = interaction.options.getString("era");
    const participantCountDown = interaction.options.getString("participant");
    const startCountDown = interaction.options.getString("start");
    const roundCountDown = interaction.options.getString("round");

    let participants = [
      {
        id: "19375613532594227",
        username: "Alice",
        health: 100,
        shield: 0,
        team: "🔴",
        weapon: { name: "Laser gun", damage: 20 },
      },
      {
        id: "19375613532594226",
        username: "Bob",
        health: 80,
        shield: 0,
        team: "🔴",
        weapon: { name: "Foam sword", damage: 10 },
      },
      {
        id: "19375613532594224",
        username: "Charlie",
        health: 120,
        shield: 0,
        team: "🟢",
        weapon: { name: "Stun gun", damage: 30 },
      },
      {
        id: "19375613532594222",
        username: "Dave",
        health: 150,
        shield: 50,
        team: "🟢",
        weapon: { name: "Pillow", damage: 5 },
      },
      {
        id: "19375613532594221",
        username: "Jhon",
        health: 150,
        shield: 50,
        team: "🟡",
        weapon: { name: "Stun gun", damage: 30 },
      },
      {
        id: "19375613532594245",
        username: "Wick",
        health: 150,
        shield: 50,
        team: "🟡",
        weapon: { name: "hand", damage: 7 },
      },
      {
        id: "19375613532594145",
        username: "Merry",
        health: 150,
        shield: 50,
        team: "🔵",
        weapon: { name: "Foam sword", damage: 10 },
      },
      {
        id: "19375613532594146",
        username: "Niory",
        health: 150,
        shield: 50,
        team: "🔵",
        weapon: { name: "Laser gun", damage: 20 },
      },

      {
        id: "19375613532594146",
        username: "Nico",
        health: 150,
        shield: 50,
        team: "⚔️",
        weapon: { name: "Foam sword", damage: 20 },
      },
      {
        id: "19375613532594166",
        username: "Sam",
        health: 150,
        shield: 50,
        team: "⚔️",
        weapon: { name: "Laser gun", damage: 20 },
      },
    ];

    // Create an embed message to participate
    let EmbedParticipateMessage = await new Discord.EmbedBuilder()
      .setColor("Random")
      .setTitle(`${SendParticipateMessage.TITLE} ${interaction.user.username} `)
      .setDescription(
        `Era: ${EraMessage(eraType)} \n
        ${SendParticipateMessage.DESCRIPTION1} ${PARTICIPANT_EMOJI} ${
          SendParticipateMessage.DESCRIPTION2
        } ${convertMillisecondsToMinutes(
          countDown(participantCountDown)
        )} minutes!`
      )
      .setThumbnail(SendParticipateMessage.IMAGE);

    // Send the embed message to respective channel
    const sentParticipantMessage = await interaction.reply({
      embeds: [EmbedParticipateMessage],
      fetchReply: true,
    });
    // Get the URL of the sent message
    //https://stackoverflow.com/questions/65982977/how-can-i-grab-the-message-link-of-a-sent-message-in-discordjs
    const ParticipantMessageUrl = `https://discord.com/channels/${sentParticipantMessage.guild.id}/${sentParticipantMessage.channel.id}/${sentParticipantMessage.id}`;
    // Add the reaction to the message
    sentParticipantMessage.react(PARTICIPANT_EMOJI);

    // Define a filter to only collect reactions that match the "⚔️" emoji
    const filter = (reaction, user) => {
      return reaction.emoji.name === PARTICIPANT_EMOJI;
    };

    // Create a reaction collector that listens for reactions matching the filter
    //https://discordjs.guide/popular-topics/collectors.html#basic-reaction-collector
    let collector = await sentParticipantMessage.createReactionCollector({
      filter,
      time: countDown(participantCountDown),
      dispose: true,
    }); // Collect reactions for given respective time  (15 seconds).

    //Timer to start the game at last seconds timer get starts
    // if the game starts in 2mins then timer start in last 1 min
    //https://stackoverflow.com/questions/70471767/discord-js-send-hyperlink-on-normal-message-just-like-in-user-message

    let ParticipantFinaleTimeout = sendTimedMessageToDiscord(
      SendTimerMessageToParticipants.TITLE,
      SendTimerMessageToParticipants.DESCRIPTION1,
      SendTimerMessageToParticipants.DESCRIPTION2,
      SendTimerMessageToParticipants.IMAGE,
      ParticipantMessageUrl,
      countDown(participantCountDown),
      [
        "Waiting for players...",
        "Preparing weapons...",
        "Discovering new dungeons...",
      ]
    );

    // Listen for reactions being added message
    // Get All the participants react to the message
    await collector.on("collect", (reaction, user) => {
      // console.log("user -->", user);
      // Check if the user who reacted is not the bot
      if (user.id !== client.user.id) {
        let participant = {
          ...user,
          username: user.username,
          health: 100,
          shield: 0,
          team: reaction.emoji.name,
          weapon: { name: "hand", damage: 7 },
        };
        participants.push(participant);
        console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
      }
    });

    // Listen for reactions being removed from the message
    // Delete the participant who has already reacted to the message and then unreacted the message.
    collector.on("remove", (reaction, user) => {
      // Check if the user who un reacted is not the bot
      if (user.id !== client.user.id) {
        //filter participant whose name matches the username of the user who removed a reaction.
        //delete from the array
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].username === user.username) {
            participants.splice(i, 1);
            console.log(`participant Removed ${user.username}'s reaction`);
            break;
          }
        }
      }
    });

    // Listen for the end of the reaction collection period
    // After respective time ends or expires gather all participants who reacts to the message.
    collector.on("end", async (collected) => {
      clearTimeout(ParticipantFinaleTimeout);
      // Create an embed message to select team
      let EmbedTeamSelectMessage = await new Discord.EmbedBuilder()
        .setColor("Random")
        .setTitle(`${SendTeamSelectMessage.TITLE} `)
        .setDescription(
          `Era: ${EraMessage(eraType)} \n
          ${SendTeamSelectMessage.DESCRIPTION1} ${TEAM_SELECT_EMOJI.join(
            " "
          )} ${
            SendTeamSelectMessage.DESCRIPTION2
          } ${convertMillisecondsToMinutes(countDown(startCountDown))} minutes!`
        )
        .setThumbnail(SendTeamSelectMessage.IMAGE);

      //send message to respective channel
      const sentTeamSelectMessage = await client.channels.cache
        .get(config.channelId)
        .send({ embeds: [EmbedTeamSelectMessage], fetchReply: true });

      const TeamSelectMessageUrl = `https://discord.com/channels/${sentTeamSelectMessage.guild.id}/${sentTeamSelectMessage.channel.id}/${sentTeamSelectMessage.id}`;

      //bot reacts to the emojis
      await TEAM_SELECT_EMOJI.map(
        async (emoji) => await sentTeamSelectMessage.react(emoji)
      );

      // Filter function for team selection collector
      // Create a reaction collector for the team selection message
      const teamCollector = await sentTeamSelectMessage.createReactionCollector(
        {
          filter: (reaction, user) =>
            TEAM_SELECT_EMOJI.includes(reaction.emoji.name) && !user.bot,
          time: countDown(startCountDown),
          dispose: true,
        }
      );

      //Timer to start the game at last seconds timer get starts
      // if the game starts in 2mins then timer start in last 1 min

      let teamFinalTimeout = sendTimedMessageToDiscord(
        SendTimerMessageToStartBattle.TITLE,
        SendTimerMessageToStartBattle.DESCRIPTION1,
        SendTimerMessageToStartBattle.DESCRIPTION2,
        SendTimerMessageToStartBattle.IMAGE,
        TeamSelectMessageUrl,
        countDown(startCountDown),
        [
          "Players selecting there teams...",
          "Preparing the dungeon...",
          "Teleporting the players...",
        ]
      );

      // Listen for reactions being added message
      // Get All the participants react to the message
      teamCollector.on("collect", async (reaction, user) => {
        // Check if the user who reacted is not the bot
        // Check if the user is a participant
        // If not then send an error message to that user
        // If user is a participant then check the user is already select a team
        // If user is already slect a team then send a error message to the user
        // Else user can react

        // Check if the user who reacted is not the bot
        if (user.id !== client.user.id) {
          let participant = null;
          for (let i = 0; i < participants.length; i++) {
            if (participants[i].id === user.id) {
              participant = participants[i];
              // break;
            }
          }
          console.log("react.id ->", participant);
          // if the participant is not exist thrn throw error
          if (!participant) {
            // send an error message to that user
            // Remove the user's latest reaction
            //https://stackoverflow.com/questions/56379469/remove-a-users-reaction-from-fetchmessage-discord-js
            reaction.users.remove(user.id);
            console.log(`${user}, ${SendUserMessage.NOT_A_PARTICIPANT}`);

            return interaction.followUp({
              content: `${user}, ${SendUserMessage.NOT_A_PARTICIPANT}`,
              ephemeral: true,
            });
          }
          //if exist check participant have select a team
          if (participant) {
            //if not then let the user selct a team
            if (participant.team === PARTICIPANT_EMOJI) {
              // update team user have react
              participant.team = reaction.emoji.name;
              console.log(
                `${SendUserMessage.SELECT} ${reaction.emoji.name} Team.`
              );
              // Send a confirmation message to the user
              return interaction.followUp({
                content: `${user}, ${SendUserMessage.SELECT} ${reaction.emoji.name} Team.`,
                ephemeral: true,
              });
            } else {
              // Remove the user's latest reaction
              reaction.users.remove(user.id);
              console.log(
                `${user}, ${SendUserMessage.ALREADY_SELECT1} ${participant.team}. ${SendUserMessage.ALREADY_SELECT2}`
              );
              return interaction.followUp({
                content: `${user}, ${SendUserMessage.ALREADY_SELECT1} ${participant.team}. ${SendUserMessage.ALREADY_SELECT2}`,
                ephemeral: true,
              });
            }
          }
        }
      });

      // Listen for reactions being removed from the message
      // update the participant who has already reacted to the message and then unreacted the message.
      teamCollector.on("remove", (reaction, user) => {
        // Check if the user who unreacted is not the bot
        if (user.id !== client.user.id) {
          // Find the participant who removed the reaction and update their team
          for (let i = 0; i < participants.length; i++) {
            if (
              participants[i].id === user.id &&
              participants[i].team === reaction.emoji.name
            ) {
              participants[i].team = PARTICIPANT_EMOJI;
              console.log(`participant Removed ${user.username}'s reaction`);
              break;
            }
          }
        }
      });

      teamCollector.on("end", async (collected) => {
        teamFinalTimeout.clearFinalTimeout();

        //check the partcipant select a team or not
        //if not then remove particpant from array
        for (let i = participants.length - 1; i >= 0; i--) {
          const participant = participants[i];
          if (participant.team === PARTICIPANT_EMOJI) {
            participants.splice(i, 1);
          }
        }

        console.log("end-->", participants);

        if (participants.length < 2) {
          SendMessageToDiscord(
            `Battle Royale session cancelled `,
            `No one was brave enough to challenge ${participants[0].username}...`,
            "https://cdn.discordapp.com/attachments/693205078621814864/693584027805810748/badge3.png",
            null,
            `Era ${EraMessage(eraType)}`
          );
        }
        if (participants.length >= 2) {
          SendMessageToDiscord(
            "Started a new Battle Royale session",
            `Number of participants: ${participants.length}.`,
            "https://cdn.discordapp.com/attachments/693205078621814864/693584027805810748/badge3.png",
            null,
            `Era ${EraMessage(eraType)}`
          );
          await royalRumble(
            participants,
            eraType,
            perRoundCountDown(roundCountDown)
          );
          gameIsRunning = false;
        }
      });
    });
  }
};

const slashcmd = {
  data: new Discord.SlashCommandBuilder()
    .setName("battle")
    .setDescription("Let's Battle ")
    .addStringOption((option) =>
      option
        .setName("era")
        .setDescription("select the era")
        .setRequired(true)
        .addChoices(
          { name: "Classic", value: "era_classic" },
          { name: "Modern", value: "era_modern" },
          { name: "Pirate", value: "era_pirate" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("participant")
        .setDescription("Count down duration before team selection start")
        .addChoices(
          { name: "1 minutes", value: "1_minutes" },
          { name: "2 minutes", value: "2_minutes" },
          { name: "3 minutes", value: "3_minutes" },
          { name: "5 minutes", value: "5_minutes" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("start")
        .setDescription("Count down duration before battle start")
        .addChoices(
          { name: "1 minutes", value: "1_minutes" },
          { name: "2 minutes", value: "2_minutes" },
          { name: "3 minutes", value: "3_minutes" },
          { name: "5 minutes", value: "5_minutes" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("round")
        .setDescription("Count down duration before start the next round")
        .addChoices(
          { name: "5 seconds", value: "5_seconds" },
          { name: "10 seconds", value: "10_seconds" },
          { name: "15 seconds", value: "15_seconds" }
        )
    ),

  // .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild),

  // perms: [],
  run: battle,
};

module.exports = slashcmd;
