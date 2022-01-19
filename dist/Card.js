export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    getRankNumber() {
        switch (this.rank) {
            case "J" || "Q" || "K":
                return 10;
                break;
            case "A":
                return 11;
                break;
            default:
                return Number(this.rank);
        }
    }
}
//# sourceMappingURL=Card.js.map