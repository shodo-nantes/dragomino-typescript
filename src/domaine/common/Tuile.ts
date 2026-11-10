import { Paysage } from "./Paysage.js";

export class Tuile {
  static readonly DE_DEPART = new Tuile(Paysage.DESERT, Paysage.VOLCAN);

  constructor(
    readonly premier: Paysage,
    readonly second: Paysage,
  ) {}
}
