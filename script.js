let game = new Vue({
  el: '#game',
  data: {
    active: false,
    end: false,
    started: false,
    won: false,
    playerMove: '',
    opponentMove: '',
    player: {
      name: 'Player',
      health: '',
      maxHealth: '',
      stamina: '',
      maxStamina: '',
      level: '',
      stats: {
        strength: '',
        agility: '',
        currentAgility: '',
        speed: '',
      },
    },
    opponent: {
      name: 'Opponent',
      health: '',
      maxHealth: '',
      stamina: '',
      maxStamina: '',
      level: '',
      stats: {
        strength: '',
        agility: '',
        currentAgility: '',
        speed: '',
      },
    },
  },
  created() {
    this.player.maxHealth = 100.0;
    this.player.health = 100.0;
    this.player.maxStamina = 100.0;
    this.player.stamina = 100.0;
    this.player.level = 1;
    this.player.stats.strength = 10;
    this.player.stats.agility = 10;
    this.player.stats.currentAgility = 10.0;
    this.player.stats.speed = 10;
    this.randomizeOpponent();
    this.opponent.level = 1;
    this.opponent.maxHealth = (this.opponent.stats.strength * 2.5 + this.opponent.level * 5 + 70.0);
    this.opponent.maxStamina = (this.opponent.stats.currentAgility * 2.5 + this.opponent.level * 5 + 70.0);
    this.opponent.health = this.opponent.maxHealth;
    this.opponent.stamina = this.opponent.maxStamina;
  },
  methods: {
    play() {
      if (this.end) {
        console.log("gameOver");
      } else if (this.active) {
        console.log("play--already active");
      } else {
        this.playerMove = '';
        this.opponentMove = '';
        this.active = true;
        this.won = false;
        console.log("play");
        if (this.started) {
          this.randomizeOpponent();
          this.opponent.level++;
          this.player.level++;
        }
        this.player.stats.currentAgility = this.player.stats.agility;
        if (this.started) {
          this.player.stats.strength++;
          //prompt for level up
        }
        this.player.maxHealth = (this.player.stats.strength * 2.5 + this.player.level * 5 + 70.0);
        this.player.maxStamina = (this.player.stats.currentAgility * 2.5 + this.player.level * 5 + 70.0);
        this.opponent.maxHealth = (this.opponent.stats.strength * 2.5 + this.opponent.level * 5 + 70.0);
        this.opponent.maxStamina = (this.opponent.stats.currentAgility * 2.5 + this.opponent.level * 5 + 70.0);
        this.player.health = this.player.maxHealth;
        this.player.stamina = this.player.maxStamina;
        this.opponent.health = this.opponent.maxHealth;
        this.opponent.stamina = this.opponent.maxStamina;
        this.started = true;
      }
    },
    randomizeOpponent() {
      this.opponent.level = this.player.level;
      var statsPool = this.opponent.level + 30;
      var s = Math.floor(Math.random() * statsPool);
      this.opponent.stats.strength = s;
      statsPool = statsPool - s;
      s = Math.floor(Math.random() * statsPool);
      this.opponent.stats.agility = s;
      statsPool = statsPool - s;
      this.opponent.stats.speed = statsPool;
      if (this.opponent.stats.strength === 0) {
        this.opponent.stats.strength = 1;
      }
      if (this.opponent.stats.speed === 0) {
        this.opponent.stats.speed = 1;
      }
      if (this.opponent.stats.agility === 0) {
        this.opponent.stats.agility = 1;
      }
      this.opponent.stats.currentAgility = this.opponent.stats.agility;
    },
    playerAttack() {
      if (!this.active) {
        console.log("Attack--not active");
      } else {
        console.log("Attack");
        if (this.player.stamina >= 15.0) {
          console.log("AttackSuccess");
          this.player.stamina = this.player.stamina - 15.0;
          var attacker = (Math.random() * this.player.stats.currentAgility) + 30.0;
          var defender = (Math.random() * this.opponent.stats.currentAgility) + 30.0;
          var amount = attacker / defender;
          console.log("Coefficient - " + amount);
          amount = amount * this.player.stats.strength;
          this.opponent.health = this.opponent.health - amount;
          this.playerMove = 0;
          if (this.opponent.health <= 0) {
            this.runTurn(true);
          } else {
            this.runTurn();
          }
        } else {
          console.log("AttackFailure");
        }
      }
    },
    playerRest() {
      if (!this.active) {
        console.log("Rest--not active");
      } else {
        console.log("Rest");
        this.player.stamina += 30.0;
        if (this.player.stamina > this.player.maxStamina) {
          this.player.stamina = this.player.maxStamina;
        }
        this.playerMove = 1;
        this.runTurn();
      }
    },
    playerEvade() {
      if (!this.active) {
        console.log("Evade--not active");
      } else {
        console.log("Evade");
        if (this.player.stamina >= 15.0) {
          console.log("EvadeSuccess");
          this.player.stamina = this.player.stamina - 15.0;
          var attacker = (Math.random() * this.player.stats.speed) + 30.0;
          var defender = (Math.random() * this.opponent.stats.speed) + 30.0;
          var amount = attacker / defender;
          console.log("Coefficient - " + amount);
          this.player.stats.currentAgility += amount * 2.5;
          this.player.maxStamina = (this.player.stats.currentAgility * 2.5 + this.player.level * 5 + 70.0);
          this.playerMove = 2;
          this.runTurn();
        } else {
          console.log("EvadeFailure");
        }
      }
    },
    runTurn(endRound = false, endGame = false) {
      if (endGame) {
        console.log("loss");
        this.active = false;
        this.end = true;
        this.player.health = 0;
      } else if (endRound) {
        this.won = true;
        console.log("win");
        this.active = false;
        this.opponent.health = 0;
      } else {
        if (this.player.stamina > this.player.maxStamina) {
          this.player.stamina = this.player.maxStamina;
        }
        var choice = Math.floor(Math.random() * 10);
        if (this.opponent.stamina < 15.0) {
          choice = 0;
        }
        if (choice === 0) {
          this.opponentRest();
        } else if (choice > 0 && choice <= 6) {
          this.opponentAttack();
        } else {
          this.opponentEvade();
        }
      }
    },
    opponentAttack() {
      if (!this.active) {
        console.log("opponentAttack--not active");
      } else {
        console.log("opponentAttack");
        if (this.opponent.stamina >= 15.0) {
          console.log("opponentAttackSuccess");
          this.opponent.stamina = this.opponent.stamina - 15.0;
          var attacker = (Math.random() * this.opponent.stats.currentAgility) + 30.0;
          var defender = (Math.random() * this.player.stats.currentAgility) + 30.0;
          var amount = attacker / defender;
          console.log("Coefficient - " + amount);
          amount = amount * this.opponent.stats.strength;
          this.player.health = this.player.health - amount;
          this.opponentMove = 0;
          if (this.player.health <= 0) {
            this.runTurn(false, true);
          }
        } else {
          console.log("AttackFailure");
        }
      }
    },
    opponentRest() {
      if (!this.active) {
        console.log("opponentRest--not active");
      } else {
        console.log("opponentRest");
        this.opponent.stamina += 30.0;
        this.oponentMove = 1;
        if (this.opponent.stamina > this.opponent.maxStamina) {
          this.opponent.stamina = this.opponent.maxStamina;
        }
      }
    },
    opponentEvade() {
      if (!this.active) {
        console.log("opponentEvade--not active");
      } else {
        console.log("opponentEvade");
        if (this.opponent.stamina >= 15.0) {
          console.log("opponentEvadeSuccess");
          this.opponent.stamina = this.opponent.stamina - 15.0;
          var attacker = (Math.random() * this.opponent.stats.speed) + 30.0;
          var defender = (Math.random() * this.player.stats.speed) + 30.0;
          var amount = attacker / defender;
          console.log("Coefficient - " + amount);
          this.opponent.stats.currentAgility += amount * 2.5;
          this.opponent.maxStamina = (this.opponent.stats.currentAgility * 2.5 + this.opponent.level * 5 + 70.0);
          this.opponentMove = 2;
        } else {
          console.log("opponentEvadeFailure");
        }
      }
    },
  },
  computed: {
    playerMessage() {
      if (this.won) {
        return "He is dead.";
      } else if (this.end) {
        return "You have died.";
      } else if (this.playerMove === '') {
        return "";
      } else if (this.playerMove === 0) {
        return "You attack!";
      } else if (this.playerMove === 1) {
        return "You rest";
      } else if (this.playerMove === 2) {
        return "You evade!";
      }
    },
    opponentMessage() {
      if (this.won) {
        return "";
      } else if (this.end) {
        return "";
      } else if (this.opponentMove === '') {
        return "";
      } else if (this.opponentMove === 0) {
        return "He attacks!";
      } else if (this.opponentMove === 1) {
        return "He rests";
      } else if (this.opponentMove === 2) {
        return "He evades!";
      }
    },
  },
  filters: {
    round(a, n) {
      return parseFloat(a).toFixed(n);
    },
  },
});
