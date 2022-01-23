import { Card } from "./Card.js";

export class Player {
  public name: string;
  public type: string;
  public chips: number = 400;
  public hand: Card[];
  public gameStatus: string;
  public bet: number;
  private winAmount: number;

  constructor(name: string, type: string, chips: number = 400) {
    // プレイヤーの手札
    this.name = name;
    this.hand = [];
    this.type = type;
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = "stand";
  }

  /*
  //      ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
  //      return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。
  //       このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
  //   */
  // public promptPlayer(userData = null) {
  //   //TODO: ここから挙動をコードしてください。
  //   if (userData) return new GameDecision(userData.gameStatus, 1);
  //   return new GameDecision(this.gameStatus, 1);
  // }

  /*
   * 合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引く。
   * return Number : 手札の合計
   */
  public getHandScore(): number {
    let aceCount = 0;
    let totalScore = this.hand.reduce(function (sum, card) {
      if (card.rank === "A") aceCount++;
      return sum + card.getRankNumber();
    }, 0);

    if (totalScore <= 21) return totalScore;

    while (totalScore > 21 && aceCount != 0) {
      totalScore -= 10;
      aceCount--;
    }

    return totalScore;
  }

  public getCard(card: Card | undefined): void {
    if (card === undefined) return;
    this.hand.push(card);
  }

  public makeBet(bet: number): number {
    this.bet = bet;
    return this.bet;
  }

  //プレイヤーのアクションの選択。{'bet', 'surrender', 'stand', 'hit', 'double'}
  public takeAction(action: string): void {
    this.gameStatus = action;
  }

  public resetBetWithHand(): void {
    this.hand = [];
    this.bet = 0;
  }

  public receivePrizeAmount(): void {
    this.chips += this.winAmount;
  }
}
