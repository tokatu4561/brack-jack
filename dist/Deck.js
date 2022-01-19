import { Card } from "./Card.js";
class Deck {
    constructor() {
        this.cards = [];
        this.startGame();
    }
    startGame() {
        const suits = ["H", "D", "C", "S"];
        const ranks = [
            "A",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
        ];
        for (let i = 1; i <= suits.length; i++) {
            for (let l = 1; l <= ranks.length; l++) {
                let card = new Card(suits[i], ranks[l]);
                this.cards.push(card);
            }
        }
    }
    shuffle() {
        const deckSize = this.cards.length;
        for (let i = deckSize - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    resetDeck() {
        this.cards = [];
        this.startGame();
        this.shuffle();
    }
    drawOne() {
        return this.cards.pop();
    }
}
export { Deck };
//# sourceMappingURL=Deck.js.map