import { Bot } from "./Bot.js";
import { Deck } from "./Deck.js";
import { Host } from "./Host.js";
import { Player } from "./Player.js";
export class Table {
    constructor(userName = "you", betDenominations = [5, 20, 50, 100]) {
        this.gamePhase = "betting";
        this.betDenominations = betDenominations;
        this.deck = new Deck();
        this.players = [new Bot(), new Player(userName), new Bot()];
        this.house = new Host();
        this.gamePhase = "betting";
        this.turnCounter = 0;
        this.resultsLog = [];
        this.house.getCard(this.deck.drawOne());
        this.assignPlayerHands();
    }
    changeTurn() {
        switch (this.gamePhase) {
            case "betting":
                if (this.getTurnPlayer() instanceof Bot) {
                    const randomNum = Math.floor(Math.random() * 4);
                    this.getTurnPlayer().makeBet(this.betDenominations[randomNum]);
                }
                if (this.onLastPlayer()) {
                    this.gamePhase = "acting";
                    this.turnCounter = 0;
                    return;
                }
                break;
            case "acting":
                if (this.getTurnPlayer() instanceof Bot) {
                    this.getTurnPlayer().takeAction("stand");
                    this.evaluateMove(this.getTurnPlayer());
                }
                if (!this.playerActionsResolved(this.getTurnPlayer())) {
                    return;
                }
                if (this.onLastPlayer()) {
                    this.gamePhase = "evaluatingWinners";
                    return;
                }
                break;
            case "evaluatingWinners":
                this.house.takeAction("stand");
                this.evaluateMoveOfHouse(this.house);
                if (!this.playerActionsResolved(this.house)) {
                    return;
                }
                this.gamePhase = "roundOver";
                return;
            case "roundOver":
                this.evaluateGameWinners();
                this.addResultLogs();
                this.turnCounter = 0;
                if (this.isGameOver()) {
                    this.gamePhase = "gameOver";
                }
                return;
        }
        this.turnCounter++;
    }
    evaluateMove(user) {
        switch (user.gameStatus) {
            case "surrender":
                user.winAmount = -(user.bet / 2);
                user.receivePrizeAmount();
                break;
            case "stand":
                break;
            case "hit":
                user.getCard(this.deck.drawOne());
                break;
            case "double":
                user.getCard(this.deck.drawOne());
                user.makeBet(user.bet * 2);
                break;
        }
        if (user.getHandScore() > 22) {
            user.gameStatus = "bust";
            user.winAmount = -user.bet;
            user.receivePrizeAmount();
        }
    }
    evaluateMoveOfHouse(user) {
        switch (user.gameStatus) {
            case "stand":
                break;
            case "hit":
                user.getCard(this.deck.drawOne());
                break;
        }
        if (user.getHandScore() > 22) {
            user.gameStatus = "bust";
        }
    }
    assignPlayerHands() {
        for (let player of this.players) {
            for (let i = 1; i <= 2; i++) {
                let dealedCard = this.deck.drawOne();
                player.getCard(dealedCard);
            }
        }
    }
    evaluateGameWinners() {
        for (let player of this.players) {
            if (player.gameStatus === "surrender") {
                player.isWin = false;
                continue;
            }
            if (player.gameStatus === "bust") {
                player.isWin = false;
                continue;
            }
            if (this.house.gameStatus == "bust") {
                player.isWin = true;
                player.winAmount = player.bet;
                player.receivePrizeAmount();
            }
            if ((player.gameStatus == "double" || player.gameStatus == "stand") &&
                this.house.getHandScore() < player.getHandScore()) {
                player.isWin = true;
                player.winAmount = player.bet;
                player.receivePrizeAmount();
            }
            else {
                player.isWin = false;
                player.winAmount = -player.bet;
                player.receivePrizeAmount();
            }
        }
    }
    clearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.resetState();
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
    playerActionsResolved(player) {
        const gameStatus = {
            bust: "bust",
            stand: "stand",
            surrender: "surrender",
        };
        if (player.gameStatus == null)
            return false;
        if (gameStatus[player.gameStatus] == undefined)
            return false;
        return true;
    }
    addResultLogs() {
        let logs = [];
        for (let player of this.players) {
            let log = {};
            log["name"] = player.name;
            log["bet"] = player.bet.toString();
            log["won"] = player.winAmount.toString();
            logs.push(log);
        }
        this.resultsLog.push(logs);
    }
    startNextGame() {
        this.clearPlayerHandsAndBets();
        this.assignPlayerHands();
        this.gamePhase = "betting";
        this.house.hand = [];
        this.house.getCard(this.deck.drawOne());
    }
    isGameOver() {
        for (let player of this.players) {
            if (player.chips <= 0) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=Table.js.map