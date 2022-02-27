export class Card {
  public suit: string; // 絵柄 (ハート等)
  public rank: string; // ランク

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  /*
   *  2-10はそのまま数値を返す。{"J", "Q", "K"}を含む、フェースカードは10を返す。
   * "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返す。
   *
   * return Number : カードのランクを基準とした整数のスコア。
   */
  public getRankNumber(): number {
    switch (this.rank) {
      case "J":
        return 10;
      case "Q":
        return 10;
      case "K":
        return 10;
      case "A":
        return 11;
      default:
        return Number(this.rank);
    }
  }
}
