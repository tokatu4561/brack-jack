export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    getRankNumber() {
        switch (this.rank) {
            case "J":
                return 10;
            case "Q":
                return 10;
            case "K":
                return 10;
            case "A":
                return 11;
            default:
                return Number(this.rank);
        }
    }
}
//# sourceMappingURL=Card.js.map