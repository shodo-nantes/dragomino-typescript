import { Plateau } from "../common/Plateau.js";
import type { Personne } from "../personne/Personne.js";

export class Joueur {
  readonly plateau = new Plateau();

  constructor(readonly personne: Personne) {}
}
