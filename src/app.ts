import { Table } from "./Table.js";
import { Player } from "./Player.js";

let table1;
// const basePage = document.getElementById("gameDiv") as HTMLDivElement;
const startPage = document.getElementById("start-form") as HTMLDivElement;
const tablePage = document.getElementById("game-table") as HTMLDivElement;
const roundOverCon = document.getElementById("round-over") as HTMLDivElement;
const bettingForm = document.getElementById("betting") as HTMLDivElement;
const actingForm = document.getElementById("acting") as HTMLDivElement;
const playerList = document.getElementById("players") as HTMLDivElement;
const dealerCon = document.getElementById("dealer-hand") as HTMLDivElement;
const userNameInput = document.getElementById("user-name") as HTMLInputElement;
const startBtn = document.getElementById("game-start") as HTMLButtonElement;
const nextGameBtn = document.getElementById("next-game") as HTMLButtonElement;
const betBtn = document.getElementById("bet-btn") as HTMLButtonElement;
const resetBetBtn = document.getElementById("btn-reset") as HTMLButtonElement;
const surrenderBtn = document.getElementById("btn-surrender") as HTMLElement;
const standBtn = document.getElementById("btn-stand") as HTMLElement;
const hitBtn = document.getElementById("btn-hit") as HTMLElement;
const doubleBtn = document.getElementById("btn-double") as HTMLElement;
const betAmountItems = document.querySelectorAll(
  ".betting-item"
) as NodeListOf<HTMLElement>;
const betTotal = document.getElementById("bet-total") as HTMLElement;

// 初期表示画面でユーザーの名前の入力を受け取り、ゲームを開始する(最初のゲームテーブルを表示させる)
startBtn.addEventListener("click", function () {
  let userName = userNameInput.value;
  if (userNameInput.value === "") {
    userName = "you";
  }
  table1 = new Table(userName);
  renderTable(table1);
});
nextGameBtn.addEventListener("click", function () {
  table1.startNextGame();
  renderTable(table1);
});
// プレイヤーがベットした後、画面を切り替える
betBtn.addEventListener("click", function () {
  let total = parseInt(betTotal.textContent);
  table1.getTurnPlayer().makeBet(total);
  table1.changeTurn();
  renderTable(table1);
});
// ベット額を0にする
resetBetBtn.addEventListener("click", function () {
  betTotal.textContent = "0";
});
// ベット額の合計の表示を切り替える
for (let i = 0; i < betAmountItems.length; i++) {
  betAmountItems[i].addEventListener("click", function () {
    let total = betSummation(betAmountItems[i], "data-bet");
    betTotal.textContent = total.toString();
  });
}
// standやdobleなどユーザがアクションをとった後、画面の表示を切り替える
surrenderBtn.addEventListener("click", function () {
  table1.getTurnPlayer().takeAction(this.dataset.action);
  table1.evaluateMove(table1.getTurnPlayer());
  table1.changeTurn();
  renderTable(table1);
});
standBtn.addEventListener("click", function () {
  table1.getTurnPlayer().takeAction(this.dataset.action);
  table1.evaluateMove(table1.getTurnPlayer());
  table1.changeTurn();
  renderTable(table1);
});
hitBtn.addEventListener("click", function () {
  table1.getTurnPlayer().takeAction(this.dataset.action);
  table1.evaluateMove(table1.getTurnPlayer());
  if (table1.getTurnPlayer().gameStatus === "bust") {
    table1.changeTurn();
  }
  renderTable(table1);
});
doubleBtn.addEventListener("click", function () {
  table1.getTurnPlayer().takeAction(this.dataset.action);
  table1.evaluateMove(table1.getTurnPlayer());
  table1.changeTurn();
  renderTable(table1);
});

function showPage(el: HTMLElement) {
  el.classList.remove("d-none");
}
function hidePage(el: HTMLElement) {
  el.classList.remove("d-flex");
  el.classList.add("d-none");
}
// ベット額の合計を算出する
function betSummation(
  inputElement: HTMLElement,
  multiplierAttribute: string
): number {
  let value = 0;
  let total = parseInt(betTotal.textContent); //現在の合計

  if (inputElement.hasAttribute(multiplierAttribute)) {
    value = parseInt(inputElement.getAttribute(multiplierAttribute));
  }

  // 入力が正の整数かどうか
  if (value > 0) total += value;

  return total;
}

// テーブルの状態を表示させる
function renderTable(table: Table): void {
  if (table.getTurnPlayer().type == "user") {
    switch (table.gamePhase) {
      case "betting":
        bettingController(table);
        break;
      case "acting":
        actingController(table);
        break;
    }
  } else {
    if (table.gamePhase == "roundOver") {
      roundOverController(table);
      table.changeTurn();
      return;
    }
    waitingController(table);
    setTimeout(function () {
      table.changeTurn();
      renderTable(table);
    }, 2000);
  }
}

function waitingController(table1: Table): void {
  hidePage(startPage);
  hidePage(bettingForm);
  hidePage(actingForm);
  showPage(tablePage);

  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table1.house));

  playerList.innerHTML = ``;
  for (let player of table1.players) {
    let playerArea = playerInfo(player);

    playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
  }
}

function actingController(table1: Table): void {
  hidePage(bettingForm);
  showPage(actingForm);

  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table1.house));
  playerList.innerHTML = ``;
  for (let player of table1.players) {
    let playerArea = playerInfo(player);

    playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
  }
}

function bettingController(table1: Table): void {
  hidePage(actingForm);
  showPage(bettingForm);

  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table1.house));
  playerList.innerHTML = ``;
  for (let player of table1.players) {
    let playerArea = playerInfo(player);

    playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
  }
}

function roundOverController(table: Table): void {
  dealerCon.append(renderDealerHands(table.house));
  playerList.innerHTML = ``;
  for (let player of table.players) {
    let playerArea = playerInfo(player);

    playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
  }
  printOutLogs(table.resultsLog);
}

function playerInfo(player: Player): HTMLDivElement {
  let container = document.createElement("div");
  let handArea = playerHands(player) as HTMLDivElement;

  container.innerHTML = `
        <div id = "curPlayerDiv" class="flex-column w-50">
            <p class="m-0 text-white text-center rem3">${player.name}</p>

            <!-- playerInfo -->
            <div class="text-white pl-16 flex-col">
                <p class="rem1 text-left">status:${player.gameStatus} </p>
                <p class="rem1 text-left">bet:${player.bet} </p>
                <p class="rem1 text-left">balance:${player.chips} </p>
            </div>
            
            ${handArea.innerHTML}
        </div><!-- end player -->
    `;
  return container;
}

//　プレイヤーが持っているカードについて表示させる内容
function playerHands(player: Player): HTMLDivElement {
  const container = document.createElement("div") as HTMLDivElement;
  const handArea = document.createElement("div") as HTMLDivElement;
  handArea.setAttribute("class", "d-flex justify-content-center");

  handArea.innerHTML = "";
  for (let i = 0; i < player.hand.length; i++) {
    let cardRank = player.hand[i].rank;
    let cardSuit = player.hand[i].suit;
    const suitsImagePath = {
      H: "/images/heart.png",
      D: "/images/diamond.png",
      C: "/images/club.png",
      S: "/images/spade.png",
    };
    let cardImagePath = suitsImagePath[cardSuit];

    handArea.innerHTML += `
    <div class="bg-white border mx-2">
        <div class="text-center">
            <img src="${cardImagePath}" alt="" width="50" height="50">
        </div>
        <div class="text-center">
            <p class="m-0">${cardRank}</p>
        </div>
    </div>
      `;
  }

  container.append(handArea);
  return container;
}

function renderDealerHands(player: Player): HTMLDivElement {
  let container = document.createElement("div");
  let handArea = playerHands(player) as HTMLDivElement;

  container.innerHTML = `${handArea.innerHTML}`;
  return container;
}

// ゲーム終了後結果のログを表示する
function printOutLogs(logs: string[][]): void {
  let container = document.createElement("div");
  for (let i = 0; i < logs.length; i++) {
    let round = document.createElement("div");
    round.textContent = `round: ${i}`;
    container.append(round);

    for (let log of logs[i]) {
      let row = document.createElement("li");
      row.innerHTML = `name:${log["name"]}, action: ${log["action"]}, bet:${log["bet"]}, won: ${log["won"]}`;
      container.append(row);
    }
  }

  roundOverCon.append(container);
}
