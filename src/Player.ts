import { Card } from "./Card";

class Player {
  private name: string;
  private type: string;
  private chips: number = 400;
  private hand: Card[];
  private gameStatus: string;
  private bet: number;
  private winAmount: number;

  constructor(
    name: string,
    type: string,
    gameType: string,
    chips: number = 400
  ) {
    // プレイヤーの手札
    this.name = name;
    this.hand = [];
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = "betting";
  }

  /*
       ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
       return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

        このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
    */
  promptPlayer(userData) {
    //TODO: ここから挙動をコードしてください。
  }

  /*
   * 合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引く。
   * return Number : 手札の合計
   */
  getHandScore(): number {
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
}
