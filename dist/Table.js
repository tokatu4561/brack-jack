import { Deck } from "./Deck.js";
import { Player } from "./Player.js";
export class Table {
    constructor(userName = "you", betDenominations = [5, 20, 50, 100]) {
        this.gamePhase = "betting";
        this.betDenominations = betDenominations;
        this.deck = new Deck();
        this.players = [
            new Player("player1", "ai"),
            new Player(userName, "user"),
            new Player("player3", "ai"),
        ];
        this.house = new Player("house", "house");
        this.gamePhase = "betting";
        this.turnCounter = 0;
        this.resultsLog = [];
        this.house.getCard(this.deck.drawOne());
        this.blackjackAssignPlayerHands();
    }
    changeTurn() {
        switch (this.gamePhase) {
            case "betting":
                if (this.getTurnPlayer().type == "ai") {
                    this.getTurnPlayer().makeBet(this.betDenominations[2]);
                }
                if (this.onLastPlayer()) {
                    this.gamePhase = "acting";
                    this.turnCounter = 0;
                    return;
                }
                break;
            case "acting":
                if (this.getTurnPlayer().type == "ai") {
                    this.getTurnPlayer().takeAction("surrender");
                    this.evaluateMove(this.getTurnPlayer());
                }
                if (this.onLastPlayer() && this.allPlayerActionsResolved()) {
                    this.gamePhase = "evaluatingWinners";
                    return;
                }
                break;
            case "evaluatingWinners":
                this.dealerAction();
                this.addResultLogs();
                this.gamePhase = "roundOver";
                return;
            case "roundOver":
                const winners = this.winnerGame();
                for (let winner of winners) {
                    winner.receivePrizeAmount();
                    console.log(winner.name);
                }
                this.turnCounter = 0;
                return;
        }
        this.turnCounter++;
    }
    evaluateMove(player) {
        switch (player.gameStatus) {
            case "surrender":
                player.gameStatus = "surrender";
                break;
            case "stand":
                player.gameStatus = "stand";
                break;
            case "hit":
                player.gameStatus = "hit";
                player.getCard(this.deck.drawOne());
                break;
            case "double":
                player.gameStatus = "double";
                player.getCard(this.deck.drawOne());
                player.makeBet(player.bet * 2);
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
            console.log(this.house.getHandScore());
            console.log(player.getHandScore());
            if (player.gameStatus === "bust")
                continue;
            if (player.gameStatus === "surrender")
                continue;
            if (this.house.gameStatus == "bust" ||
                this.house.getHandScore() < player.getHandScore()) {
                winners.push(player);
            }
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
    addResultLogs() {
        let logs = [];
        for (let player of this.players) {
            let log = {};
            log["name"] = player.name;
            log["action"] = player.gameStatus;
            log["bet"] = player.bet.toString();
            log["won"] = player.winAmount.toString();
            logs.push(log);
        }
        this.resultsLog.push(logs);
    }
    dealerAction() {
        while (this.house.getHandScore() < 18) {
            this.house.takeAction("hit");
            this.evaluateMove(this.house);
        }
    }
    startNextGame() {
        this.blackjackClearPlayerHandsAndBets();
        this.blackjackAssignPlayerHands();
        this.gamePhase = "betting";
        this.house.hand = [];
        this.house.getCard(this.deck.drawOne());
    }
}
//# sourceMappingURL=Table.js.map