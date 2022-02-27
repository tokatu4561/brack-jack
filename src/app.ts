import { Table } from "./Table.js";
import { Player } from "./Player.js";
import { Host } from "./Host.js";
import { Bot } from "./Bot.js";

let table1;

//　表示するコンテンツ
const startPage = document.getElementById("start-form") as HTMLDivElement;
const tablePage = document.getElementById("game-table") as HTMLDivElement;
const roundOverCon = document.getElementById("round-over") as HTMLDivElement;
const gameOverCon = document.getElementById("game-over") as HTMLDivElement;
const gameRogCon = document.getElementById("game-log") as HTMLDivElement;
const bettingForm = document.getElementById("betting") as HTMLDivElement;
const actingForm = document.getElementById("acting") as HTMLDivElement;
const playerList = document.getElementById("players") as HTMLDivElement;
const dealerCon = document.getElementById("dealer-hand") as HTMLDivElement;
const userNameInput = document.getElementById("user-name") as HTMLInputElement;

// Bet & Action ボタン
const startBtn = document.getElementById("game-start") as HTMLButtonElement;
const nextGameBtn = document.getElementById("next-game") as HTMLButtonElement;
const betBtn = document.getElementById("bet-btn") as HTMLButtonElement;
const resetBetBtn = document.getElementById("btn-reset") as HTMLButtonElement;
const actionBtns = document.querySelectorAll(
  ".btn-action"
) as NodeListOf<HTMLButtonElement>;
const betAmountBtns = document.querySelectorAll(
  ".betting-item"
) as NodeListOf<HTMLButtonElement>;
const betTotal = document.getElementById("bet-total") as HTMLElement;
const userBalance = document.getElementById("user-balance") as HTMLElement;

// 初期表示画面でユーザーの名前の入力を受け取り、ゲームを開始する(最初のゲームテーブルを表示させる)
startBtn.addEventListener("click", function () {
  let userName = userNameInput.value;
  if (userNameInput.value === "") {
    userName = "you";
  }
  table1 = new Table(userName);
  renderTable(table1);
});

// １ゲームが終わった後、ゲームオーバーでなければ次のゲームを開始する
nextGameBtn.addEventListener("click", function () {
  table1.startNextGame();
  hidePage(roundOverCon);
  renderTable(table1);
});

// ベット額を0にする
resetBetBtn.addEventListener("click", function () {
  betTotal.textContent = "0";
  changeBetBtnStateClickable();
});

// ベット額の合計の表示を切り替える
for (let i = 0; i < betAmountBtns.length; i++) {
  betAmountBtns[i].addEventListener("click", function () {
    let total = betSummation(betAmountBtns[i], "data-bet");
    changeBetBtnStateClickable();
    betTotal.textContent = total.toString();
  });
}

// プレイヤーがベットした後、画面を切り替える
betBtn.addEventListener("click", function () {
  let total = parseInt(betTotal.textContent);
  table1.getTurnPlayer().makeBet(total);
  table1.changeTurn();
  renderTable(table1);
});

// プレイしているユーザーのアクション　standやdobleなどユーザがアクションをとった後、画面の表示を切り替える
for (let i = 0; i < actionBtns.length; i++) {
  actionBtns[i].addEventListener("click", function () {
    table1.getTurnPlayer().takeAction(this.dataset.action);
    table1.evaluateMove(table1.getTurnPlayer());

    if (
      this.dataset.action == "hit" &&
      table1.getTurnPlayer().gameStatus !== "bust"
    ) {
      renderTable(table1);
      return;
    }

    table1.changeTurn();
    renderTable(table1);
  });
}

//画面に描画するページーの表示・非表示切り替え関数
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

//　ベットと残高の状態からベットするボタンの状態を切り替える
function changeBetBtnStateClickable(): void {
  for (let i = 0; i < betAmountBtns.length; i++) {
    const isClickAble =
      Number(betTotal.textContent) + Number(betAmountBtns[i].dataset.bet) <
      Number(userBalance.textContent);

    if (isClickAble) {
      betAmountBtns[i].removeAttribute("disabled");
      betAmountBtns[i].classList.remove("opacity-50");
    } else {
      betAmountBtns[i].classList.add("opacity-50");
      betAmountBtns[i].setAttribute("disabled", "");
    }
  }
}

// 現在テーブルの状態を表示させる
function renderTable(table: Table): void {
  if (table.gamePhase == "roundOver") {
    table.changeTurn();
    roundOverController(table);
    return;
  }

  if (table.getTurnPlayer() instanceof Player) {
    switch (table.gamePhase) {
      case "betting":
        bettingController(table);
        return;
      case "acting":
        actingController(table);
        return;
    }
  }

  waitingController(table);
  setTimeout(function () {
    table.changeTurn();
    renderTable(table);
  }, 1500);
}

/*
 * Controller 画面の表示を制御する
 */
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

function actingController(table: Table): void {
  hidePage(bettingForm);
  showPage(actingForm);

  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table.house));
  renderPlayersInfo(table.players);
}

function bettingController(table: Table): void {
  hidePage(actingForm);
  showPage(bettingForm);

  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table.house));
  renderPlayersInfo(table.players);
}

function roundOverController(table: Table): void {
  dealerCon.innerHTML = "";
  dealerCon.append(renderDealerHands(table.house));
  renderPlayersInfo(table.players);
  if (table.gamePhase == "gameOver") {
    gameOverController(table);
    return;
  }

  showPage(roundOverCon);
  printOutLogs(table.resultsLog);
}

function gameOverController(table: Table): void {
  showPage(gameOverCon);
  printOutLogs(table.resultsLog);
}

//　各プレイヤーの情報を画面に表示する
function renderPlayersInfo(players: Player[]) {
  playerList.innerHTML = ``;
  for (let player of players) {
    if (player instanceof Player) {
      userBalance.innerHTML = player.chips.toString();
    }

    let playerArea = playerInfo(player);

    playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
  }
}
function playerInfo(player: Player): HTMLDivElement {
  let container = document.createElement("div");
  let handArea = playerHands(player) as HTMLDivElement;

  const gameResultContent = player.isWin
    ? '<p class="m-0 text-orange-500 text-center text-5xl">WIN</p>'
    : '<p class="m-0 text-blue-800 text-center text-5xl">LOSE</p>';
  const gameResult = table1.gamePhase == "roundOver" ? gameResultContent : "";

  container.innerHTML = `
        <div id = "curPlayerDiv" class="flex-column w-50">
            ${gameResult}
            <p class="m-0 text-white text-center text-5xl">${player.name}</p>

            <!-- playerInfo -->
            <div class="text-white pl-16 flex-col">
                <p class="rem1 text-left">bet:${player.bet} </p>
                <p class="rem1 text-left">残金:${player.chips} </p>
            </div>
            
            ${handArea.innerHTML}
        </div><!-- end player -->
    `;
  return container;
}

//　プレイヤーが持っているカードについて表示させる内容
function playerHands(player: Player | Host | Bot): HTMLDivElement {
  const container = document.createElement("div") as HTMLDivElement;
  const handArea = document.createElement("div") as HTMLDivElement;
  handArea.setAttribute("class", "flex justify-content-center");

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
    <div class="bg-white p-2 rounded border mx-2">
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

//ディーラーの手札を表示させる
function renderDealerHands(player: Host): HTMLDivElement {
  let container = document.createElement("div");
  let handArea = playerHands(player) as HTMLDivElement;

  container.innerHTML = `${handArea.innerHTML}`;
  return container;
}

// ゲーム結果のログを表示する;
function printOutLogs(logs: string[][]): void {
  let container = document.createElement("ul");
  container.classList.add("list-none");

  for (let i = 0; i < logs.length; i++) {
    let round = document.createElement("div");
    round.textContent = `round: ${i + 1}`;
    container.append(round);

    for (let log of logs[i]) {
      let row = document.createElement("li");
      row.innerHTML = `${log["name"]}, 獲得:${log["won"]}`;
      container.append(row);
    }
  }

  gameRogCon.innerHTML = "";
  gameRogCon.append(container);
}
