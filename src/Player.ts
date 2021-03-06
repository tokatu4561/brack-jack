import { User } from "./User.js";

export class Player extends User {
  public chips: number = 400;
  public bet: number;
  public winAmount: number;
  public isWin: boolean;

  constructor(name: string, chips: number = 400) {
    super();
    this.name = name;
    this.hand = [];
    this.chips = chips;
    this.bet = 0;
    this.winAmount = 0;
    this.gameStatus = "stand";
    this.isWin = false;
  }

  public makeBet(bet: number): number {
    this.bet = bet;
    return this.bet;
  }

  public receivePrizeAmount(): void {
    this.chips += this.winAmount;
  }

  public takeAction(action: string) {
    this.gameStatus = action;
  }
}
