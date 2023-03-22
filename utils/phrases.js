// Add random phrase to the attack message

//this how the message show on discord
// Common string
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}** 


// Combine strings
// attack message
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}** and dealt **${weapon.damage}** damage randomPhrase(eraType) (health: **${defender.health}**)

//friendly fire message
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}** (**friendly fire**) and dealt **${weapon.damage}** damage randomPhrase(eraType) (health: **${defender.health}**)

//defend shiled message
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}**  but the defender's shield blocked **${weapon.damage}** damage (shield: **${defender.shield}**)

//shiled depleted message
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}** but the defender's shield has been depleted! Next attack will reduce the defender's health directly.

//kill message
// **${attacker.username}** attacked **${defender.username}** with **${weapon.name}** and killed **${defender.username}**!


//this are the random phrases which era type you select
//ex:- if you select classic ERA it ill only gets the classic phrases
//era types
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

const PirateMessage = [
  " and pirate delivers a crushing blow!",
  " but pirate misses the mark.",
  " and pirate catches the defender off guard!",
  " and pirate strikes with deadly accuracy!",
  " but pirate the defender manages to dodge the attack.",
  " and pirate leaves the defender reeling from the impact!",
];


