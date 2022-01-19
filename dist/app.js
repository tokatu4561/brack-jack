import { Table } from "./Table.js";
let table1 = new Table();
while (table1.gamePhase != "roundOver") {
    table1.changeTurn();
}
console.log("game end");
//# sourceMappingURL=app.js.map