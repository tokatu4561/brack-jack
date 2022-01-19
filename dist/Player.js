import { GameDecision } from "./GameDecision.js";
export class Player {
    constructor(name, type, chips = 400) {
        this.chips = 400;
        this.name = name;
        this.hand = [];
        this.type = type;
        this.chips = chips;
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "stand";
    }
    promptPlayer(userData = null) {
        if (userData)
            return new GameDecision(userData.gameStatus, 1);
        return new GameDecision(this.gameStatus, 1);
    }
    getHandScore() {
        let aceCount = 0;
        let totalScore = this.hand.reduce(function (sum, card) {
            if (card.rank === "A")
                aceCount++;
            return sum + card.getRankNumber();
        }, 0);
        if (totalScore <= 21)
            return totalScore;
        while (totalScore > 21 && aceCount != 0) {
            totalScore -= 10;
            aceCount--;
        }
        return totalScore;
    }
    getCard(card) {
        if (card === undefined)
            return;
        this.hand.push(card);
    }
    makeBet(bet) {
        this.bet = bet;
        return this.bet;
    }
    resetBetWithHand() {
        this.hand = [];
        this.bet = 0;
    }
    receivePrizeAmount() {
        this.chips += this.winAmount;
    }
}
//# sourceMappingURL=Player.js.map