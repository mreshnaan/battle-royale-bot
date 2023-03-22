const { randomPhrase } = require("../helper");
class Player {
  constructor(name, team, health, shield, weapon, type) {
    this.name = name;
    this.team = team;
    this.health = health;
    this.shield = shield;
    this.weapon = weapon || { name: "fists", damage: 5 };
    this.era = type;
  }

  attack(target) {
    let damage = this.weapon.damage;
    let isFriendlyFire = this.team === target.team;
    let message = `${this.name} attacked ${target.name} with ${this.weapon.name}`;

    if (isFriendlyFire) {
      message += " (friendly fire)";
    }

    if (target.shield > 0) {
      target.shield -= damage;

      if (target.shield <= 0) {
        target.shield = 0;
        message += ` but the defender's shield has been depleted! Next attack will reduce the defender's health directly.`;
      }

      if (target.shield > 0) {
        message += ` but the defender's shield blocked ${damage} damage`;
        message += ` (shield: ${target.shield})`;
      }
    } else {
      target.health -= damage;

      if (target.health <= 0) {
        target.health = 0;
        message += ` and killed ${target.name}!`;
      }

      if (target.health > 0) {
        message += ` and dealt ${damage} damage`;
        message += randomPhrase(this.era);
        message += ` (health: ${target.health})`;
      }
    }

    return message;
  }
}
module.exports = Player;
