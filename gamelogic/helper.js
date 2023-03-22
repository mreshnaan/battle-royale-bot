const { client, Discord } = require("../utils/imports");
const config = require("../utils/config");
const {
  ClassicMessage,
  ModernMessage,
  PirateMessage,
} = require("../utils/constant");

const randomIndex = (length) => {
  return Math.floor(Math.random() * length);
};

const convertMillisecondsToSeconds = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  return seconds;
};

const convertMillisecondsToMinutes = (milliseconds) => {
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  return minutes;
};

const randomPhrase = (eraType) => {
  if (!eraType) {
    console.log("era is empty");
  }
  let phrase;

  switch (eraType) {
    case "era_classic":
      // select a classic phrase
      phrase = ClassicMessage;
      break;
    case "era_modern":
      // select a modern phrase
      phrase = ModernMessage;
      break;
    case "era_pirate":
      // select a pirate phrase
      phrase = PirateMessage;
      break;
    default:
      // the user did not select a valid category
      console.log("please select a era");
      break;
  }

  return phrase[randomIndex(phrase.length)];
};

const EraMessage = (eraType) => {
  if (!eraType) {
    console.log("era is empty");
  }
  let message;
  switch (eraType) {
    case "era_classic":
      message = "Classic";
      break;
    case "era_modern":
      message = "Modern";
      break;
    case "era_pirate":
      message = "Pirate";
      break;

    default:
      message = "";
      break;
  }
  return message;
};

const countDown = (time) => {
  let countDownInSeconds;
  switch (time) {
    case "1_minutes":
      countDownInSeconds = "60000";
      break;

    case "2_minutes":
      countDownInSeconds = "120000";
      break;

    case "3_minutes":
      countDownInSeconds = "180000";
      break;

    case "5_minutes":
      countDownInSeconds = "300000";
      break;

    default:
      countDownInSeconds = "60000";
      break;
  }
  return countDownInSeconds;
};

const perRoundCountDown = (time) => {
  let countDownInSeconds;
  switch (time) {
    case "5_seconds":
      countDownInSeconds = "5000";
      break;

    case "10_seconds":
      countDownInSeconds = "10000";
      break;
    case "15_seconds":
      countDownInSeconds = "15000";
      break;
    default:
      countDownInSeconds = "5000";
      break;
  }
  return countDownInSeconds;
};

// https://discord.js.org/#/docs/discord.js/stable/class/MessageEmbed
const SendMessageToDiscord = async (
  title,
  message,
  thumbnail,
  image,
  footer
) => {
  let EmbedMessage = new Discord.EmbedBuilder()
    .setColor("Random")
    .setTitle(title || null)
    .setDescription(message || null)
    .setThumbnail(thumbnail || null)
    .setImage(image || null)
    .setFooter({
      text: footer || null,
    });

  await client.channels.cache
    .get(config.channelId)
    .send({ embeds: [EmbedMessage] });
};

function sendTimedMessageToDiscord(
  title,
  description1,
  description2,
  image,
  url,
  timeout,
  timeoutMessages
) {
  let halfTimer = timeout / 2;
  let quarterTimer = timeout / 4;
  let eighthTimer = timeout / 8;

  let finalTimeout;

  let firstTimeout = setTimeout(function () {
    SendMessageToDiscord(
      title,
      `${description1} ${convertMillisecondsToSeconds(
        halfTimer
      )} ${description2}
          [Jump!](${url})`,
      image,
      null,
      timeoutMessages[0]
    );

    let secondTimeout = setTimeout(function () {
      clearTimeout(firstTimeout);
      SendMessageToDiscord(
        title,
        `${description1} ${convertMillisecondsToSeconds(
          quarterTimer
        )} ${description2}
            [Jump!](${url})`,
        image,
        null,
        timeoutMessages[1]
      );
      finalTimeout = setTimeout(function () {
        clearTimeout(secondTimeout);
        SendMessageToDiscord(
          title,
          `${description1} ${convertMillisecondsToSeconds(
            eighthTimer
          )} ${description2}
              [Jump!](${url})`,
          image,
          null,
          timeoutMessages[2]
        );
      }, eighthTimer);
    }, quarterTimer);
  }, halfTimer);

  return {
    clearFinalTimeout: function () {
      clearTimeout(finalTimeout);
    },
  };
}



//check the user have a shield
//if defender user have a shield then decrease from attacker user weapon
//check if attacker user have a weapon
//if attacker user have a weapon then decrease the shield from defender user
//else attack by hand
//else defender user doest have a shield then decrease the health from  attacker user weapon
//if defender user doest have health then eleminate the player
// check if same team mates attack each other
//if then just send a message called friendly fire
function eachPlayerAttackAndDefend(eliminator, eliminated, weapon, eraType) {
  const isFriendlyFire = eliminator.team === eliminated.team;

  //get the user weapon damage
  let damage = weapon.damage;
  // let attacker = eliminator.name
  // let defender = eliminated.name
  // Check if the eliminated have a shield
  //if eliminated have a shiled then decrease the shield bar by the weapon damage

  let message = `**${eliminator.username}** attacked **${eliminated.username}** with **${weapon.name}**`;

  // If the attacker and defender are on the same team send message as friendly fire message
  if (isFriendlyFire) {
    message += " (**friendly fire**) ";
  }
  // Check if the defender has a shield
  if (eliminated.shield > 0) {
    eliminated.shield -= damage;
    // Check if the defender's shield has gone below 0
    //then set the shield to 0
    if (eliminated.shield <= 0) {
      eliminated.shield = 0;
      message += ` but the defender's shield has been depleted! Next attack will reduce the defender's health directly.`;
    }

    if (eliminated.shield > 0) {
      message += ` but the defender's shield blocked **${weapon.damage}** damage`;
      message += ` (shield: **${eliminated.shield}**)`;
    }
  } else {
    //If eliminated doesnt have a shield then decrease eliminated health bar by weapon damage
    eliminated.health -= damage;
    //check if the health of the eliminated player is less than or equal to zero
    if (eliminated.health <= 0) {
      eliminated.health = 0;
      message += ` and killed **${eliminated.username}**!`;
    }

    if (eliminated.health > 0) {
      message += ` and dealt **${weapon.damage}** damage`;
      message += randomPhrase(eraType);
      message += ` (health: **${eliminated.health}**)`;
    }
  }
  return message;
}

//keep track of each participnats team
// get all participants
// loop through all the participant
// get the participant team
// keep track of ech participant
// check if the team found
// If the team exists, increment the count by 1.
// Otherwise add a new team with a count of 1.
function getPlayersByTeam(participants) {
  const teams = [];

  for (const participant of participants) {
    // check the team is alrady exist on the remaning team
    const isTeam = teams.find((team) => team.name === participant.team);
    // check If the team doest exist then add a new team with the partcipant count of 1.
    //if team exist then increment the partcipant count by 1
    // if (isTeam) {
    //   console.log("isTeam name -->", isTeam.name);
    // }
    if (!isTeam) {
      teams.push({
        name: participant.team,
        count: 1,
        players: [participant],
      });
    }
    if (isTeam) {
      // console.log("isTeam name -->", isTeam);
      isTeam.count++;
    }
  }
  console.log("teams -->", teams);
  return teams;
}


const gameHelper = {
  randomIndex,
  randomPhrase,
  convertMillisecondsToSeconds,
  convertMillisecondsToMinutes,
  SendMessageToDiscord,
  countDown,
  perRoundCountDown,
  EraMessage,
  sendTimedMessageToDiscord,
};
module.exports = gameHelper;
