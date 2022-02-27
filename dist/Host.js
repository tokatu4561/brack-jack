import { User } from "./User.js";
export class Host extends User {
    constructor() {
        super();
        this.name = "Host";
        this.gameStatus = "stand";
    }
    takeAction(action) {
        this.gameStatus = action;
        if (this.getHandScore() < 14) {
            this.gameStatus = "hit";
        }
    }
}
//# sourceMappingURL=Host.js.map