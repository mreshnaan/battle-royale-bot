const StatusMessage = {
  SUCCESS: "Success",
  FAILED: "Failed",
};

const ClassicMessage = [
  " and classic delivers a crushing blow!",
  " but classic misses the mark.",
  " and classic catches the defender off guard!",
  " and classic strikes with deadly accuracy!",
  " but classic the defender manages to dodge the attack.",
  " and classic leaves the defender reeling from the impact!",
];

const ModernMessage = [
  " and modern delivers a crushing blow!",
  " but modern misses the mark.",
  " and modern catches the defender off guard!",
  " and modern strikes with deadly accuracy!",
  " but modern the defender manages to dodge the attack.",
  " and modern leaves the defender reeling from the impact!",
];

// Add random phrase to the attack message
const PirateMessage = [
  " and pirate delivers a crushing blow!",
  " but pirate misses the mark.",
  " and pirate catches the defender off guard!",
  " and pirate strikes with deadly accuracy!",
  " but pirate the defender manages to dodge the attack.",
  " and pirate leaves the defender reeling from the impact!",
];



const ErrorMessages = {
  COMMAND_PERMISSION: "Sorry, this command can only be used in",
  GAME_START: "The game has already started. Please wait until it finishes",
};

const SendParticipateMessage = {
  TITLE: "Battle Royale hosted by",
  DESCRIPTION1: "Click the emoji",
  DESCRIPTION2: "below to join. Starting in",
  IMAGE:
    "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png",
};

const SendTimerMessageToParticipants = {
  TITLE: "Battle Royale",
  DESCRIPTION1: "Team Selection will start in",
  DESCRIPTION2: "seconds",
  IMAGE:
    "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png",
};

const SendTimerMessageToStartBattle = {
  TITLE: "Battle Royale",
  DESCRIPTION1: "Battle will start in",
  DESCRIPTION2: "seconds",
  IMAGE:
    "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png",
};

const SendTeamSelectMessage = {
  TITLE: "React with your team color to join a team!",
  DESCRIPTION1: "Click the emoji",
  DESCRIPTION2: "below to join. Starting in ",
  IMAGE:
    "https://cdn.discordapp.com/attachments/614764053591490589/693571006870061086/badge2.png",
};

const SendUserMessage = {
  NOT_A_PARTICIPANT: "You Not a Participant",
  SELECT: "You Select for",
  ALREADY_SELECT1: "You Are Already Select a Team ",
  ALREADY_SELECT2: "You Can't Select a Another Team",
};

// SendMessage = {
//   WiNNER_IMAGE:
//     "https://cdn.discordapp.com/attachments/693205078621814864/909563944438476852/NeonY-01.png",
// };

module.exports = {
  StatusMessage,
  ClassicMessage,
  ModernMessage,
  PirateMessage,
  SendParticipateMessage,
  SendTimerMessageToParticipants,
  SendTimerMessageToStartBattle,
  SendTeamSelectMessage,
  SendUserMessage,
  ErrorMessages,
};
