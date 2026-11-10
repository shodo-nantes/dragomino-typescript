import { ArgumentInvalideError } from "../ArgumentInvalideError.js";
import type { Personne } from "../personne/Personne.js";
import { Joueur } from "./Joueur.js";

const NOMBRE_MINIMUM_DE_JOUEURS = 2;
const NOMBRE_MAXIMUM_DE_JOUEURS = 4;

export class Partie {
  // Les personnes sont comparées par valeur (leur nom), d'où la clé de type string.
  readonly #joueurs = new Map<string, Joueur>();

  constructor(personnes: readonly Personne[]) {
    if (personnes.length < NOMBRE_MINIMUM_DE_JOUEURS || personnes.length > NOMBRE_MAXIMUM_DE_JOUEURS) {
      throw new ArgumentInvalideError(
        `Une partie se joue de ${NOMBRE_MINIMUM_DE_JOUEURS} à ${NOMBRE_MAXIMUM_DE_JOUEURS} joueurs, reçu : ${personnes.length}`,
      );
    }
    for (const personne of personnes) {
      if (this.#joueurs.has(personne.nom)) {
        throw new ArgumentInvalideError(`Une personne ne peut participer qu'une fois : ${personne.nom}`);
      }
      this.#joueurs.set(personne.nom, new Joueur(personne));
    }
  }

  get joueurs(): readonly Joueur[] {
    return [...this.#joueurs.values()];
  }

  joueurDe(personne: Personne): Joueur {
    const joueur = this.#joueurs.get(personne.nom);
    if (joueur === undefined) {
      throw new ArgumentInvalideError(`Personne inconnue dans cette partie : ${personne.nom}`);
    }
    return joueur;
  }
}
