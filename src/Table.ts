import { Deck } from "./Deck.js";
import { Player } from "./Player.js";

export class Table {
  public players: Player[];
  public house: Player;
  private deck: Deck;
  public gamePhase: string = "betting"; //{'betting', 'acting', 'evaluatingWinners','roundOver'} から選択
  private betDenominations: number[];
  private turnCounter: number;
  public resultsLog: string[][];

  constructor(userName = "you", betDenominations = [5, 20, 50, 100]) {
    // プレイヤーが選択できるベットの単位。
    this.betDenominations = betDenominations;
    this.deck = new Deck();
    // 3人のAIプレイヤーとハウス、「betting」フェースの始まり
    this.players = [
      new Player("player1", "ai"),
      new Player(userName, "user"),
      new Player("player3", "ai"),
    ];
    this.house = new Player("house", "house");
    this.gamePhase = "betting";
    this.turnCounter = 0;
    // ラウンドの結果をログに記録するための文字列の配列。
    this.resultsLog = [];

    this.house.getCard(this.deck.drawOne());
    this.blackjackAssignPlayerHands();
  }

  //   テーブルとプレイヤーの状態を更新し、次のプレイヤーのターンへ切り替える
  public changeTurn(): void {
    switch (this.gamePhase) {
      case "betting":
        if (this.getTurnPlayer().type == "ai") {
          //TODO　aiなら一旦固定で100を入れている、自動で選択されるように変更する必要あり
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
          //TODO　aiなら一旦固定で100を入れている、自動で選択されるように変更する必要あり
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
        this.evaluateGameWinners();
        this.turnCounter = 0;
        return;
    }

    this.turnCounter++;
  }

  /*
   *Player player : Playerのとった行動により状態を更新します。
   * EX:プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
   */
  public evaluateMove(player: Player): void {
    switch (player.gameStatus) {
      case "surrender":
        player.gameStatus = "surrender";
        player.winAmount = -(player.bet / 2);
        player.receivePrizeAmount();
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
      player.winAmount = -player.bet;
      player.receivePrizeAmount();
    }
  }

  /*
   *return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
   * NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
   */
  blackjackEvaluateAndGetRoundResults() {
    if (this.onLastPlayer()) {
      this.allPlayerActionsResolved();
    }

    // ゲームオーバーのプレイヤーがいれば終了
  }

  /*
   * デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
   * NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
   */
  private blackjackAssignPlayerHands(): void {
    for (let player of this.players) {
      for (let i = 1; i <= 2; i++) {
        let dealedCard = this.deck.drawOne();
        player.getCard(dealedCard);
      }
    }
  }

  //   プレイヤーとハウスの結果を評価し、勝者は残金、ベットの状態を更新する
  private evaluateGameWinners() {
    for (let player of this.players) {
      if (player.gameStatus === "surrender") {
        player.isWin = false;
        continue;
      }
      if (player.gameStatus === "bust") {
        player.isWin = false;
        continue;
      }

      //以下はゲームに勝利した場合
      if (
        this.house.gameStatus == "bust" ||
        (this.house.getHandScore() < player.getHandScore() &&
          player.gameStatus == "double")
      ) {
        player.isWin = true;
        player.winAmount = player.bet * 2;
        player.receivePrizeAmount();
      } else {
        // プレイヤーの状態がstandだった場合
        player.isWin = false;
        player.winAmount = player.bet;
        player.receivePrizeAmount();
      }
    }
  }

  /*
   *テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定
   */
  public blackjackClearPlayerHandsAndBets(): void {
    for (let player of this.players) {
      player.resetBetWithHand();
    }
  }

  /*
   *return Player : 現在のプレイヤー
   */
  public getTurnPlayer(): Player {
    return this.players[this.turnCounter];
  }

  /*
   * return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
   */
  private onLastPlayer(): boolean {
    if (this.turnCounter == this.players.length - 1) return true;

    return false;
  }

  /*
   *全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返す。
   */
  allPlayerActionsResolved(): boolean {
    const gameStatus: { [props: string]: string } = {
      bust: "bust",
      stand: "stand",
      surrender: "surrender",
    };
    for (let player of this.players) {
      if (player.gameStatus == null) return false;
      if (gameStatus[player.gameStatus] == undefined) return false;
    }

    return true;
  }

  //ラウンドの終わりに結果をログに追加する
  public addResultLogs(): void {
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

  public dealerAction(): void {
    while (this.house.getHandScore() < 18) {
      this.house.takeAction("hit");
      this.evaluateMove(this.house);
    }
  }

  public startNextGame(): void {
    this.blackjackClearPlayerHandsAndBets();
    this.blackjackAssignPlayerHands();
    this.gamePhase = "betting";
    this.house.hand = [];
    this.house.getCard(this.deck.drawOne());
  }
}
