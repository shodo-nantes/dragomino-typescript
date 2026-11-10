import { describe, expect, it } from "vitest";
import { Tuile } from "../common/Tuile.js";
import { Personne } from "../personne/Personne.js";
import { Joueur } from "./Joueur.js";

describe("Joueur", () => {
  it("un joueur est associé à une personne", () => {
    const alice = new Personne("Alice");

    expect(new Joueur(alice).personne).toEqual(alice);
  });

  it("un joueur démarre avec un plateau initial", () => {
    expect(new Joueur(new Personne("Alice")).plateau.tuiles).toEqual([Tuile.DE_DEPART]);
  });

  it("deux joueurs ne partagent pas leur plateau", () => {
    const premier = new Joueur(new Personne("Alice"));
    const second = new Joueur(new Personne("Bob"));

    expect(premier.plateau).not.toBe(second.plateau);
  });

});
