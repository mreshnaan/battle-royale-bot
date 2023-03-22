const { randomIndex, randomPhrase, SendMessageToDiscord } = require("./helper");
const Player = require("./class/Player.js");


//each round gets 6 or less participants
// get all the particpants
//loop through with limited participants
//get two random participant by generation a random number
//make sure two ramdom number not the same and not the same participants
//remove one praticipant from random select participant
async function runRound(participants, eraType, perRoundCountDown) {
  const roundEliminations = [];

  // To generate a random number greater than 2 or equal to 2 and less than 6 or eaual to 6
  //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  let getRoundRandomParticipants = Math.floor(Math.random() * 5) + 2;
  // Set a timeout to end the round
  for (let i = 0; i < getRoundRandomParticipants; i++) {
    //stop when participant length is 1
    if (participants.length === 1) break;
    //get two random players with eleminate pharse and remove one player and store those deatils to the empty array
    let eliminatorPlayer = randomIndex(participants.length);
    let eliminatedPlayer = randomIndex(participants.length - 1);

    // ensure eliminator and eliminated are different players
    if (eliminatedPlayer === eliminatorPlayer) {
      eliminatedPlayer++;
    }
    let eliminator = participants[eliminatorPlayer];
    let eliminated = participants[eliminatedPlayer];
    let weapon;

    if (!eliminator.weapon || eliminator.weapon.name === "") {
      weapon = { name: "hand", damage: 7 };
    } else {
      weapon = eliminator.weapon;
    }

    let eliminatorDetails = new Player(
      eliminator.name,
      eliminator.team,
      eliminator.health,
      eliminator.shield,
      eliminator.weapon,
      eraType
    );

    let EliminateResult = eliminatorDetails.attack(eliminated);

    // let EliminateResult = eachPlayerAttackAndDefend(
    //   eliminator,
    //   eliminated,
    //   weapon,
    //   eraType
    // );

    roundEliminations.push(EliminateResult);
    //check user healbar is 0 then remove from the participant array
    if (eliminated.health <= 0) {
      // loop through remaining players on the team
      //if the player got eliminated then update the coun from that respective team
      participants.splice(eliminatedPlayer, 1);
    }
  }

  //https://stackoverflow.com/questions/24928846/get-return-value-from-settimeout
  // setTimeout in a Promise and wait for it to resolve
  const timerRoundEliminations = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(roundEliminations);
    }, perRoundCountDown);
  });

  return timerRoundEliminations;
}

//get all participants
//loop thrugh un till only one participant remain and announce the winner
//each round has 6 or less participants
//each round display the who eleminate whom
//each round all eliminators goes to the remaining participants
async function royalRumble(participants, eraType, perRoundCountDown) {
  let remainingParticipants = [...participants];
  let eliminations = [];

  //loop untill one participant remains
  while (remainingParticipants.length > 1) {
    let roundEliminations = await runRound(
      remainingParticipants,
      eraType,
      perRoundCountDown
    );

    SendMessageToDiscord(
      `Round ${eliminations.length + 1} Eliminations:`,
      roundEliminations.join("\n"),
      null,
      null,
      `Player Left : ${remainingParticipants.length}`
    );

    eliminations.push(roundEliminations);
  }

  SendMessageToDiscord(
    `The winner of the Battle Royal is:`,
    `${remainingParticipants[0].team}${" "}${
      remainingParticipants[0].username
    }!`,
    null,
    "https://cdn.discordapp.com/attachments/693205078621814864/909563944438476852/NeonY-01.png"
  );
  participants.push(...remainingParticipants);
  return eliminations;
}

module.exports = royalRumble;
