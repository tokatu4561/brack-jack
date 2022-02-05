import { Card } from "./Card.js";

export class Player {
  public name: string;
  public type: string;
  public chips: number = 400;
  public hand: Card[];
  public gameStatus: string;
  public bet: number;
  public winAmount: number;
  public isWin: boolean;

  constructor(name: string, type: string, chips: number = 400) {
    this.name = name;
    this.hand = [];
    this.type = type;
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = "stand";
    this.isWin = false;
  }

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
