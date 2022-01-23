import { Table } from "./Table.js";
let table1;
const startPage = document.getElementById("start-form");
const tablePage = document.getElementById("game-table");
const bettingForm = document.getElementById("betting");
const actingForm = document.getElementById("acting");
const playerList = document.getElementById("players");
const userNameInput = document.getElementById("user-name");
const startBtn = document.getElementById("game-start");
const betBtn = document.getElementById("bet-btn");
const betAmountItems = document.querySelectorAll(".betting-item");
const betTotal = document.getElementById("bet-total");
startBtn.addEventListener("click", function () {
    let userName = userNameInput.value;
    if (userNameInput.value === "") {
        userName = "you";
    }
    table1 = new Table(userName);
    renderTable(table1);
});
betBtn.addEventListener("click", function () {
    let total = parseInt(betTotal.textContent);
    renderTable(table1, total);
});
for (let i = 0; i < betAmountItems.length; i++) {
    betAmountItems[i].addEventListener("click", function () {
        let total = betSummation(betAmountItems[i], "data-bet");
        betTotal.textContent = total.toString();
    });
}
function showPage(el) {
    el.classList.remove("d-none");
}
function hidePage(el) {
    el.classList.remove("d-flex");
    el.classList.add("d-none");
}
function renderTable(table, userInput = null) {
    if (table.getTurnPlayer().type == "user") {
        switch (table.gamePhase) {
            case "betting":
                table.getTurnPlayer().makeBet(userInput);
                bettingController(table);
                table.changeTurn();
                break;
            case "acting":
                actingController(table);
                table.changeTurn();
                break;
            case "roundOver":
                console.log("game end");
                return;
        }
    }
    else {
        waitingController(table);
        setTimeout(function () {
            table.changeTurn();
            renderTable(table);
        }, 2000);
    }
}
function waitingController(table1) {
    hidePage(startPage);
    hidePage(bettingForm);
    hidePage(actingForm);
    showPage(tablePage);
    playerList.innerHTML = ``;
    for (let player of table1.players) {
        let playerArea = playerInfo(player);
        playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
    }
}
function actingController(table1) {
    hidePage(bettingForm);
    showPage(actingForm);
    playerList.innerHTML = ``;
    for (let player of table1.players) {
        let playerArea = playerInfo(player);
        playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
    }
}
function bettingController(table1) {
    hidePage(actingForm);
    showPage(bettingForm);
    playerList.innerHTML = ``;
    for (let player of table1.players) {
        let playerArea = playerInfo(player);
        playerList.innerHTML += `
    ${playerArea.innerHTML}
  `;
    }
}
function playerInfo(player) {
    let container = document.createElement("div");
    let handArea = playerHands(player);
    container.innerHTML = `
        <div id = "curPlayerDiv" class="flex-column w-50">
            <p class="m-0 text-white text-center rem3">${player.name}</p>

            <!-- playerInfo -->
            <div class="text-white d-flex m-0 p-0 justify-content-center">
                <p class="rem1 text-left">status:${player.gameStatus} </a>
                <p class="rem1 text-left">bet:${player.bet} </a>
                <p class="rem1 text-left">balance:${player.chips} </a>
            </div>
            
            ${handArea.innerHTML}
        </div><!-- end player -->
    `;
    return container;
}
function playerHands(player) {
    const container = document.createElement("div");
    const handArea = document.createElement("div");
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
//# sourceMappingURL=app.js.map