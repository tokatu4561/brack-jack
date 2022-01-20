import { Deck } from "./Deck.js";
import { Player } from "./Player.js";
export class Table {
    constructor(betDenominations = [5, 20, 50, 100]) {
        this.gamePhase = "betting";
        this.betDenominations = betDenominations;
        this.deck = new Deck();
        this.players = [
            new Player("player1", "ai"),
            new Player("player2", "ai"),
            new Player("player3", "ai"),
        ];
        this.house = new Player("house", "house");
        this.gamePhase = "betting";
        this.turnCounter = 0;
        this.blackjackAssignPlayerHands();
    }
    changeTurn() {
        switch (this.gamePhase) {
            case "betting":
                this.getTurnPlayer().makeBet(this.betDenominations[2]);
                if (this.onLastPlayer()) {
                    this.gamePhase = "acting";
                    this.turnCounter = 0;
                    return;
                }
                break;
            case "acting":
                this.evaluateMove(this.getTurnPlayer());
                if (this.onLastPlayer() && this.allPlayerActionsResolved()) {
                    this.gamePhase = "evaluatingWinners";
                    return;
                }
                break;
            case "evaluatingWinners":
                this.gamePhase = "roundOver";
                const winners = this.winnerGame();
                for (let winner of winners) {
                    winner.receivePrizeAmount();
                    console.log(winner.name);
                }
                this.blackjackClearPlayerHandsAndBets();
                return;
        }
        this.turnCounter++;
    }
    evaluateMove(player) {
        const Decision = player.promptPlayer();
        switch (Decision.action) {
            case "surrender":
                player.gameStatus = "surrender";
                break;
            case "stand":
                player.gameStatus = "stand";
                player.makeBet(Decision.amount);
                break;
            case "hit":
                player.gameStatus = "hit";
                player.getCard(this.deck.drawOne());
                break;
            case "double":
                player.gameStatus = "double";
                player.getCard(this.deck.drawOne());
                player.makeBet(Decision.amount * 2);
        }
        if (player.getHandScore() > 22) {
            player.gameStatus = "bust";
            player.chips -= player.bet;
        }
    }
    blackjackEvaluateAndGetRoundResults() {
        if (this.onLastPlayer()) {
            this.allPlayerActionsResolved();
        }
    }
    blackjackAssignPlayerHands() {
        for (let player of this.players) {
            for (let i = 1; i <= 2; i++) {
                let dealedCard = this.deck.drawOne();
                player.getCard(dealedCard);
            }
        }
    }
    winnerGame() {
        let winners = [];
        for (let player of this.players) {
            if (player.gameStatus === "bust")
                continue;
            if (this.house.getHandScore() < player.getHandScore())
                winners.push(player);
        }
        return winners;
    }
    blackjackClearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.resetBetWithHand();
        }
    }
    getTurnPlayer() {
        return this.players[this.turnCounter];
    }
    onLastPlayer() {
        if (this.turnCounter == this.players.length - 1)
            return true;
        return false;
    }
    allPlayerActionsResolved() {
        const gameStatus = {
            broken: "broken",
            bust: "bust",
            stand: "stand",
            surrender: "surrender",
        };
        for (let player of this.players) {
            if (player.gameStatus == null)
                return false;
            if (gameStatus[player.gameStatus] == undefined)
                return false;
        }
        return true;
    }
}
//# sourceMappingURL=Table.js.map