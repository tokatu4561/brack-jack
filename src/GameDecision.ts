class GameDecision {
  private action: string; //プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
  private amount: number;

  constructor(action: string, amount: number) {
    // アクション
    this.action = action;
    // プレイヤーが選択する数値
    this.amount = amount;
  }
}
