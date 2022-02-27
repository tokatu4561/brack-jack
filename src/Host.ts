import { User } from "./User.js";

export class Host extends User {
  constructor() {
    super();
    this.name = "Host";
    this.gameStatus = "stand";
  }

  public takeAction(action: string) {
    this.gameStatus = action;

    if (this.getHandScore() < 14) {
      this.gameStatus = "hit";
    }
  }
}
