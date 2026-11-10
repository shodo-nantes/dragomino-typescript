import { Tuile } from "./Tuile.js";

export class Plateau {
  readonly #tuiles: readonly Tuile[] = Object.freeze([Tuile.DE_DEPART]);

  get tuiles(): readonly Tuile[] {
    return this.#tuiles;
  }
}
