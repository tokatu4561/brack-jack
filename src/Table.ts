import { Bot } from "./Bot.js";
import { Deck } from "./Deck.js";
import { Host } from "./Host.js";
import { Player } from "./Player.js";
import { User } from "./User.js";

export class Table {
  public players: Array<Player | Bot>;
  public house: Host;
  private deck: Deck;
  public gamePhase: string = "betting"; //{'betting', 'acting', 'evaluatingWinners','roundOver', 'gameOver'} から選択
  private betDenominations: number[];
  private turnCounter: number;
  public resultsLog: string[][];

  constructor(userName = "you", betDenominations = [5, 20, 50, 100]) {
    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;
    this.deck = new Deck();
    // 3人のAIプレイヤーとハウス、「betting」フェースの始まり
    this.players = [new Bot(), new Player(userName), new Bot()];
    this.house = new Host();
    this.gamePhase = "betting";
    this.turnCounter = 0;
    // ラウンドの結果をログに記録するための文字列の配列。
    this.resultsLog = [];

    this.house.getCard(this.deck.drawOne());
    this.assignPlayerHands();
  }

  //   テーブルとプレイヤーの状態を更新し、次のプレイヤーのターンへ切り替える
  public changeTurn(): void {
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

        //プレイヤーの状態が{'bust', 'stand', 'surrender'}以外であればもう一度そのプレイヤーのターンにする
        if (!this.playerActionsResolved(this.getTurnPlayer())) {
          return;
        }

        //最後のターンのプレイヤーであればevaluatingWinners(ゲームの勝敗を決める)フェーズへ
        if (this.onLastPlayer()) {
          this.gamePhase = "evaluatingWinners";
          return;
        }

        break;
      case "evaluatingWinners":
        //ゲーム終了の前に、ディーラーを行動を実施する
        this.house.takeAction("stand");
        this.evaluateMoveOfHouse(this.house);
        //ディーラーの状態が{'bust', 'stand', 'surrender'}以外であればもうディーラーのターンにする
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

  /*
   *　Playerのとった行動により状態を更新します。
   * プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引く。
   */
  public evaluateMove(user: Bot | Player): void {
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

  /*
   *　Houseの行動を評価して、状態を更新
   */
  public evaluateMoveOfHouse(user: Host): void {
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

  // デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新。
  private assignPlayerHands(): void {
    for (let player of this.players) {
      for (let i = 1; i <= 2; i++) {
        let dealedCard = this.deck.drawOne();
        player.getCard(dealedCard);
      }
    }
  }

  //   プレイヤーとハウスの結果を評価し、勝者は残金、ベットの状態を更新する
  private evaluateGameWinners(): void {
    for (let player of this.players) {
      if (player.gameStatus === "surrender") {
        player.isWin = false;
        continue;
      }
      if (player.gameStatus === "bust") {
        player.isWin = false;
        continue;
      }
      //ディーラーがbustしていたら全プレイヤーの勝利
      if (this.house.gameStatus == "bust") {
        player.isWin = true;
        player.winAmount = player.bet;
        player.receivePrizeAmount();
      }

      if (
        (player.gameStatus == "double" || player.gameStatus == "stand") &&
        this.house.getHandScore() < player.getHandScore()
      ) {
        // プレイヤーの状態がstandだった場合
        player.isWin = true;
        player.winAmount = player.bet;
        player.receivePrizeAmount();
      } else {
        player.isWin = false;
        player.winAmount = -player.bet;
        player.receivePrizeAmount();
      }
    }
  }

  /*
   *テーブル内のすべてのプレイヤーの、手札を空の配列に、ベットを0に設定
   */
  private clearPlayerHandsAndBets(): void {
    for (let player of this.players) {
      player.resetState();
    }
  }

  /*
   *return Player : 現在のプレイヤー
   */
  public getTurnPlayer(): Player {
    return this.players[this.turnCounter];
  }

  /*
   * return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされているか。
   */
  private onLastPlayer(): boolean {
    if (this.turnCounter == this.players.length - 1) return true;

    return false;
  }

  /*
   *プレイヤーがセット{'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返す。
   */
  private playerActionsResolved(player: User): boolean {
    const gameStatus: { [props: string]: string } = {
      bust: "bust",
      stand: "stand",
      surrender: "surrender",
    };

    if (player.gameStatus == null) return false;
    if (gameStatus[player.gameStatus] == undefined) return false;

    return true;
  }

  //ラウンドの終わりに結果をログに追加する
  private addResultLogs(): void {
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

  public startNextGame(): void {
    this.clearPlayerHandsAndBets();
    this.assignPlayerHands();
    this.gamePhase = "betting";
    this.house.hand = [];
    this.house.getCard(this.deck.drawOne());
  }

  private isGameOver(): boolean {
    for (let player of this.players) {
      if (player.chips <= 0) {
        return true;
      }
    }

    return false;
  }
}
