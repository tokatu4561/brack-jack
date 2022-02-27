import { User } from "./User.js";

export class Bot extends User {
  public chips: number = 400;
  public bet: number = 0;
  public winAmount: number = 0;
  public isWin: boolean;

  constructor() {
    super();
    this.name = "Bot";
    this.hand = [];
    this.gameStatus = "stand";
    this.isWin = false;
  }

  public makeBet(bet: number): number {
    if (bet > this.chips) {
      bet = this.chips;
    }
    this.bet = bet;
    return this.bet;
  }

  public receivePrizeAmount(): void {
    this.chips += this.winAmount;
  }

  public takeAction(action: string) {
    this.gameStatus = action;

    const handScore = this.getHandScore();

    if (handScore < 12) {
      this.gameStatus = "double";
    }

    if (handScore < 14) {
      this.gameStatus = "hit";
    }
  }
}
