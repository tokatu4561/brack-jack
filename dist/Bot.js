import { User } from "./User.js";
export class Bot extends User {
    constructor() {
        super();
        this.chips = 400;
        this.bet = 0;
        this.winAmount = 0;
        this.name = "Bot";
        this.hand = [];
        this.gameStatus = "stand";
        this.isWin = false;
    }
    makeBet(bet) {
        if (bet > this.chips) {
            bet = this.chips;
        }
        this.bet = bet;
        return this.bet;
    }
    receivePrizeAmount() {
        this.chips += this.winAmount;
    }
    takeAction(action) {
        this.gameStatus = action;
        const handScore = this.getHandScore();
        if (handScore < 12) {
            this.gameStatus = "double";
        }
        if (handScore < 14) {
            this.gameStatus = "hit";
        }
    }
}
//# sourceMappingURL=Bot.js.map