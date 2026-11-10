import { describe, expect, it } from "vitest";
import { ArgumentInvalideError } from "../ArgumentInvalideError.js";
import { Tuile } from "../common/Tuile.js";
import { Personne } from "../personne/Personne.js";
import { Partie } from "./Partie.js";

const personnes = (nombre: number) =>
  Array.from({ length: nombre }, (_, i) => new Personne(`Personne ${i + 1}`));

describe("Partie", () => {
  it.each([0, 1, 5])("une partie exige entre 2 et 4 personnes (%i refusé)", (nombre) => {
    expect(() => new Partie(personnes(nombre))).toThrow(ArgumentInvalideError);
  });

  it.each([2, 3, 4])("une partie accepte de 2 à 4 personnes (%i)", (nombre) => {
    expect(new Partie(personnes(nombre)).joueurs).toHaveLength(nombre);
  });

  it("chaque personne devient un joueur avec son propre plateau initial", () => {
    const alice = new Personne("Alice");
    const bob = new Personne("Bob");

    const partie = new Partie([alice, bob]);

    expect(partie.joueurs.map((j) => j.personne)).toEqual([alice, bob]);
    for (const joueur of partie.joueurs) {
      expect(joueur.plateau.tuiles).toEqual([Tuile.DE_DEPART]);
    }
    expect(partie.joueurDe(alice).plateau).not.toBe(partie.joueurDe(bob).plateau);
  });

  it("une personne ne peut pas apparaître deux fois", () => {
    expect(() => new Partie([new Personne("Alice"), new Personne("Alice")])).toThrow(ArgumentInvalideError);
  });

  it("le joueur d'une personne inconnue est refusé", () => {
    const partie = new Partie(personnes(2));

    expect(() => partie.joueurDe(new Personne("Intrus"))).toThrow(ArgumentInvalideError);
  });

});
