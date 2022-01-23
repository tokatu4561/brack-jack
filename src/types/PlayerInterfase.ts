import { Card } from "../Card";

export interface Player {
  name: string;
  hand: Card[];
  handScore: number;
  getCard(card: Card): void;
  stand(): void;
  hit(card: Card): void;
  resetState(): void;
}
