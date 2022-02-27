import { User } from "./User.js";
export class Player extends User {
    constructor(name, chips = 400) {
        super();
        this.chips = 400;
        this.name = name;
        this.hand = [];
        this.chips = chips;
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "stand";
        this.isWin = false;
    }
    makeBet(bet) {
        this.bet = bet;
        return this.bet;
    }
    receivePrizeAmount() {
        this.chips += this.winAmount;
    }
    takeAction(action) {
        this.gameStatus = action;
    }
}
//# sourceMappingURL=Player.js.map