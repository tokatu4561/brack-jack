import { Card } from "./Card.js";

export abstract class User {
  public name: string;
  public hand: Card[] = [];
  public gameStatus: string;

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

    while (totalScore > 21 && aceCount > 0) {
      totalScore -= 10;
      aceCount--;
    }

    return totalScore;
  }

  public getCard(card: Card | undefined): void {
    if (card === undefined) return;
    this.hand.push(card);
  }

  public resetState(): void {
    this.hand = [];
    this.gameStatus = "stand";
  }

  //プレイヤーのアクションの選択。{'bet', 'surrender', 'stand', 'hit', 'double'}
  public abstract takeAction(action: string): void;
}
