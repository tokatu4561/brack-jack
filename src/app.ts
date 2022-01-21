import { Table } from "./Table.js";

let table1 = new Table();

const startPage = document.getElementById("gameDiv") as HTMLDivElement;
const startBtn = document.getElementById("game-start") as HTMLButtonElement;

startBtn.addEventListener("click", function () {
  renderTable(table1);
});

function renderTable(table1): void {
  if (table1.getTurnPlayer().type == "user") {
    switch (table1.gamePhase) {
      case "betting":
        bettingController();
        table1.changeTurn();
        break;
      case "acting":
        actingController();
        table1.changeTurn();
        break;
      case "roundOver":
        startPage.innerHTML = "";
        startPage.append(bettingPage());
        console.log("game end");
        return;
    }
  } else {
    waitingController();
    setTimeout(function () {
      table1.changeTurn();
      renderTable(table1);
    }, 2000);
  }
}

function waitingController() {
  startPage.innerHTML = "";
  startPage.append(waitingPage());
}

function actingController() {
  startPage.innerHTML = "";
  startPage.append(actingPage());
}

function bettingController() {
  startPage.innerHTML = "";
  startPage.append(bettingPage());
}

function waitingPage(): HTMLDivElement {
  let container = document.createElement("div");

  container.innerHTML = `
  <!-- all cards (dealer, players) div -->
  <div class="col-12">
      <div class="pt-5">
          <p class="m-0 text-center text-white rem3">Dealer</p>

          <!-- House Card Row -->
          <div id="houesCardDiv" class="d-flex justify-content-center pt-3 pb-5">

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0 ">7</p>
                  </div>
              </div>

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/diamond.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0">8</p>
                  </div>
              </div>

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0">9</p>
                  </div>
              </div>
          </div>
      </div>

      <div class="">

          <!-- Players Div -->
          <div id="playersDiv" class="d-flex justify-content-center">

              <!-- nonCurPlayerDiv 1-->
              <div id="nonCurPlayer1Div" class="flex-column">

                  <p class="m-0 text-white text-center rem3">ai1</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-between">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>
                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->

              <!-- curPlayerDiv -->
              <div id = "curPlayerDiv" class="flex-column w-50">
                  <p class="m-0 text-white text-center rem3">ai2</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-center">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>

                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->

              <!-- nonCurPlayer2Div -->
              <div id="nonCurPlayer2Div" class="flex-column">

                  <p class="m-0 text-white text-center rem3">Yuki</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-between">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>

                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->
          </div><!-- end players -->
      </div>
  </div>
  `;

  return container;
}

function bettingPage(): HTMLDivElement {
  let container = document.createElement("div");

  container.innerHTML = `
  <!-- all cards (dealer, players) div -->
  <div class="col-12">
      <div class="pt-5">
          <p class="m-0 text-center text-white rem3">Dealer</p>

          <!-- House Card Row -->
          <div id="houesCardDiv" class="d-flex justify-content-center pt-3 pb-5">

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0 ">7</p>
                  </div>
              </div>

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/diamond.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0">8</p>
                  </div>
              </div>

              <div class="bg-white border mx-2">
                  <div class="text-center">
                      <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                  </div>
                  <div class="text-center">
                      <p class="m-0">9</p>
                  </div>
              </div>
          </div>
      </div>

      <div class="">

          <!-- Players Div -->
          <div id="playersDiv" class="d-flex justify-content-center">

              <!-- nonCurPlayerDiv 1-->
              <div id="nonCurPlayer1Div" class="flex-column">

                  <p class="m-0 text-white text-center rem3">ai1</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-between">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>
                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->

              <!-- curPlayerDiv -->
              <div id = "curPlayerDiv" class="flex-column w-50">
                  <p class="m-0 text-white text-center rem3">ai2</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-center">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>

                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->

              <!-- nonCurPlayer2Div -->
              <div id="nonCurPlayer2Div" class="flex-column">

                  <p class="m-0 text-white text-center rem3">Yuki</p>

                  <!-- playerInfoDiv -->
                  <div class="text-white d-flex m-0 p-0 justify-content-between">
                      <p class="rem1 text-left">S:BUST </a>
                      <p class="rem1 text-left">B:0 </a>
                      <p class="rem1 text-left">R:255 </a>
                  </div>

                  <!-- cardsDiv -->
                  <div class="d-flex justify-content-center">
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">2</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">10</p>
                          </div>
                      </div>
                      <div class="bg-white border mx-2">
                          <div class="text-center">
                              <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                          </div>
                          <div class="text-center">
                              <p class="m-0">8</p>
                          </div>
                      </div><!-- end card -->
                  </div><!-- end Cards -->
              </div><!-- end player -->
          </div><!-- end players -->

          <!-- actionsAndBetsDiv -->
          <div id="actionsAndBetsDiv" class="d-flex pb-5 pt-4 justify-content-center">
               <!-- betsDiv -->
              <div id="betsDiv" class="d-flex flex-column w-50">
                  <!-- bottom half of bets including chip increments and submit  -->
                  <div class="py-2 h-60 d-flex justify-content-between">
                      <!-- betChoiceDiv -->
                      <div>
                          <div class="input-group" >
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-danger btn-number">
                                      -
                                  </button>
                              </span>
                              <input type="text" class="input-number text-center" size="2" maxlength="5" value="3">
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-success btn-number">
                                      +
                                  </button>
                              </span>
                          </div><!--end input group div -->
                          <p class="text-white text-center">5</p>
                      </div> <!-- end betChoiceDiv -->
                      <!-- betChoiceDiv -->
                      <div>
                          <div class="input-group" >
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-danger btn-number">
                                      -
                                  </button>
                              </span>
                              <input type="text" class="input-number text-center" size="2" maxlength="5" value="0">
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-success btn-number">
                                      +
                                  </button>
                              </span>
                          </div><!--end input group div -->
                          <p class="text-white text-center">20</p>
                      </div> <!-- end betChoiceDiv -->
                      <!-- betChoiceDiv -->
                      <div>
                          <div class="input-group" >
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-danger btn-number">
                                      -
                                  </button>
                              </span>
                              <input type="text" class="input-number text-center" size="2" maxlength="5" value="0">
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-success btn-number">
                                      +
                                  </button>
                              </span>
                          </div><!--end input group div -->
                          <p class="text-white text-center">50</p>
                      </div> <!-- end betChoiceDiv -->
                      <!-- betChoiceDiv -->
                      <div>
                          <div class="input-group" >
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-danger btn-number">
                                      -
                                  </button>
                              </span>
                              <input type="text" class="input-number text-center" size="2" maxlength="5" value="0">
                              <span class="input-group-btn">
                                  <button type="button" class="btn btn-success btn-number">
                                      +
                                  </button>
                              </span>
                          </div><!--end input group div -->
                          <p class="text-white text-center">100</p>
                      </div> <!-- end betChoiceDiv -->
                  </div><!-- end bestSelectionDiv -->
                  <!-- betSubmitDiv -->
                  <button id="bet-btn" class="w-100 btn-success rem5 text-center bg-primary">
                      ベットしてください
                  </button><!-- end betSubmitDiv -->
              </div><!-- end betsDiv-->

          </div><!-- end actionsAndBetsDiv-->
      </div>
  </div>
  `;

  container.querySelector("#bet-btn").addEventListener("click", function () {
    renderTable(table1);
  });

  return container;
}

function actingPage() {
  let container = document.createElement("div");

  container.innerHTML = `
  <div class="col-12">
        <div class="pt-5">
            <p class="m-0 text-center text-white rem3">Dealer</p>

            <!-- House Card Row -->
            <div id="houesCardDiv" class="d-flex justify-content-center pt-3 pb-5">

                <div class="bg-white border mx-2">
                    <div class="text-center">
                        <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                    </div>
                    <div class="text-center">
                        <p class="m-0 ">7</p>
                    </div>
                </div>

                <div class="bg-white border mx-2">
                    <div class="text-center">
                        <img src="/img/dashboard/lessons/projects/diamond.png" alt="" width="50" height="50">
                    </div>
                    <div class="text-center">
                        <p class="m-0">8</p>
                    </div>
                </div>

                <div class="bg-white border mx-2">
                    <div class="text-center">
                        <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                    </div>
                    <div class="text-center">
                        <p class="m-0">9</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="">

            <!-- Players Div -->
            <div id="playersDiv" class="d-flex justify-content-center">

                <!-- nonCurPlayerDiv 1-->
                <div id="nonCurPlayer1Div" class="flex-column">

                    <p class="m-0 text-white text-center rem3">ai1</p>

                    <!-- playerInfoDiv -->
                    <div class="text-white d-flex m-0 p-0 justify-content-between">
                        <p class="rem1 text-left">S:BUST </a>
                        <p class="rem1 text-left">B:0 </a>
                        <p class="rem1 text-left">R:255 </a>
                    </div>
                    <!-- cardsDiv -->
                    <div class="d-flex justify-content-center">
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">2</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">10</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">8</p>
                            </div>
                        </div><!-- end card -->
                    </div><!-- end Cards -->
                </div><!-- end player -->

                <!-- curPlayerDiv -->
                <div id = "curPlayerDiv" class="flex-column w-50">
                    <p class="m-0 text-white text-center rem3">ai2</p>

                    <!-- playerInfoDiv -->
                    <div class="text-white d-flex m-0 p-0 justify-content-center">
                        <p class="rem1 text-left">S:BUST </a>
                        <p class="rem1 text-left">B:0 </a>
                        <p class="rem1 text-left">R:255 </a>
                    </div>

                    <!-- cardsDiv -->
                    <div class="d-flex justify-content-center">
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">2</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">10</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">8</p>
                            </div>
                        </div><!-- end card -->
                    </div><!-- end Cards -->
                </div><!-- end player -->

                <!-- nonCurPlayer2Div -->
                <div id="nonCurPlayer2Div" class="flex-column">

                    <p class="m-0 text-white text-center rem3">Yuki</p>

                    <!-- playerInfoDiv -->
                    <div class="text-white d-flex m-0 p-0 justify-content-between">
                        <p class="rem1 text-left">S:BUST </a>
                        <p class="rem1 text-left">B:0 </a>
                        <p class="rem1 text-left">R:255 </a>
                    </div>

                    <!-- cardsDiv -->
                    <div class="d-flex justify-content-center">
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/heart.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">2</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/clover.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">10</p>
                            </div>
                        </div>
                        <div class="bg-white border mx-2">
                            <div class="text-center">
                                <img src="/img/dashboard/lessons/projects/spade.png" alt="" width="50" height="50">
                            </div>
                            <div class="text-center">
                                <p class="m-0">8</p>
                            </div>
                        </div><!-- end card -->
                    </div><!-- end Cards -->
                </div><!-- end player -->
            </div><!-- end players -->

            <!-- actionsAndBetsDiv -->
            <div id="actionsAndBetsDiv" class="d-flex pb-5 pt-4 justify-content-center">

                <!-- actionsDiv -->
                <div id ="actionsDiv" class="d-flex flex-wrap w-70">
                    <div class="py-2">
                        <a class="text-dark btn btn-light px-5 py-1">Surrender</a>
                    </div>
                    <div class="py-2">
                        <a class="btn btn-success px-5 py-1">Stand</a>
                    </div>
                    <div class="py-2">
                        <a class="btn btn-warning px-5 py-1">Hit</a>
                    </div>
                    <div class="py-2">
                        <a class="btn btn-danger px-5 py-1">Double</a>
                    </div>
                </div> <!-- end actionsDiv -->
            </div><!-- end actionsAndBetsDiv-->
        </div>
    </div>
  `;

  return container;
}
