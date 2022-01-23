export class Card {
  public suit: string; // 絵柄 (ハート等)
  public rank: string; // ランク

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  /*
   *  2-10はそのまま数値を返します。{"J", "Q", "K"}を含む、フェースカードは10を返します。
   * "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
   *
   * return Number : カードのランクを基準とした整数のスコア。
   */
  getRankNumber(): number {
    switch (this.rank) {
      case "J" || "Q" || "K":
        return 10;
        break;
      case "A":
        return 11;
        break;
      default:
        return Number(this.rank);
    }
  }
}
