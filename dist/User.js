export class User {
    constructor() {
        this.hand = [];
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
        while (totalScore > 21 && aceCount > 0) {
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
    resetState() {
        this.hand = [];
        this.gameStatus = "stand";
    }
}
//# sourceMappingURL=User.js.map