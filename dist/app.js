import { Table } from "./Table.js";
import { Player } from "./Player.js";
let table1;
const startPage = document.getElementById("start-form");
const tablePage = document.getElementById("game-table");
const roundOverCon = document.getElementById("round-over");
const gameOverCon = document.getElementById("game-over");
const gameRogCon = document.getElementById("game-log");
const bettingForm = document.getElementById("betting");
const actingForm = document.getElementById("acting");
const playerList = document.getElementById("players");
const dealerCon = document.getElementById("dealer-hand");
const userNameInput = document.getElementById("user-name");
const startBtn = document.getElementById("game-start");
const nextGameBtn = document.getElementById("next-game");
const betBtn = document.getElementById("bet-btn");
const resetBetBtn = document.getElementById("btn-reset");
const actionBtns = document.querySelectorAll(".btn-action");
const betAmountBtns = document.querySelectorAll(".betting-item");
const betTotal = document.getElementById("bet-total");
const userBalance = document.getElementById("user-balance");
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
    hidePage(roundOverCon);
    renderTable(table1);
});
resetBetBtn.addEventListener("click", function () {
    betTotal.textContent = "0";
    changeBetBtnStateClickable();
});
for (let i = 0; i < betAmountBtns.length; i++) {
    betAmountBtns[i].addEventListener("click", function () {
        let total = betSummation(betAmountBtns[i], "data-bet");
        changeBetBtnStateClickable();
        betTotal.textContent = total.toString();
    });
}
betBtn.addEventListener("click", function () {
    let total = parseInt(betTotal.textContent);
    table1.getTurnPlayer().makeBet(total);
    table1.changeTurn();
    renderTable(table1);
});
for (let i = 0; i < actionBtns.length; i++) {
    actionBtns[i].addEventListener("click", function () {
        table1.getTurnPlayer().takeAction(this.dataset.action);
        table1.evaluateMove(table1.getTurnPlayer());
        if (this.dataset.action == "hit" &&
            table1.getTurnPlayer().gameStatus !== "bust") {
            renderTable(table1);
            return;
        }
        table1.changeTurn();
        renderTable(table1);
    });
}
function showPage(el) {
    el.classList.remove("d-none");
}
function hidePage(el) {
    el.classList.remove("d-flex");
    el.classList.add("d-none");
}
function betSummation(inputElement, multiplierAttribute) {
    let value = 0;
    let total = parseInt(betTotal.textContent);
    if (inputElement.hasAttribute(multiplierAttribute)) {
        value = parseInt(inputElement.getAttribute(multiplierAttribute));
    }
    if (value > 0)
        total += value;
    return total;
}
function changeBetBtnStateClickable() {
    for (let i = 0; i < betAmountBtns.length; i++) {
        const isClickAble = Number(betTotal.textContent) + Number(betAmountBtns[i].dataset.bet) <
            Number(userBalance.textContent);
        if (isClickAble) {
            betAmountBtns[i].removeAttribute("disabled");
            betAmountBtns[i].classList.remove("opacity-50");
        }
        else {
            betAmountBtns[i].classList.add("opacity-50");
            betAmountBtns[i].setAttribute("disabled", "");
        }
    }
}
function renderTable(table) {
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
    }, 2000);
}
function waitingController(table1) {
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
function actingController(table) {
    hidePage(bettingForm);
    showPage(actingForm);
    dealerCon.innerHTML = "";
    dealerCon.append(renderDealerHands(table.house));
    renderPlayersInfo(table.players);
}
function bettingController(table) {
    hidePage(actingForm);
    showPage(bettingForm);
    dealerCon.innerHTML = "";
    dealerCon.append(renderDealerHands(table.house));
    renderPlayersInfo(table.players);
}
function roundOverController(table) {
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
function gameOverController(table) {
    showPage(gameOverCon);
    printOutLogs(table.resultsLog);
}
function renderPlayersInfo(players) {
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
function playerInfo(player) {
    let container = document.createElement("div");
    let handArea = playerHands(player);
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
function playerHands(player) {
    const container = document.createElement("div");
    const handArea = document.createElement("div");
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
function renderDealerHands(player) {
    let container = document.createElement("div");
    let handArea = playerHands(player);
    container.innerHTML = `${handArea.innerHTML}`;
    return container;
}
function printOutLogs(logs) {
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
//# sourceMappingURL=app.js.map