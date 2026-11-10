import { describe, expect, it } from "vitest";
import { Plateau } from "./Plateau.js";
import { Tuile } from "./Tuile.js";

describe("Plateau", () => {
  it("un plateau neuf ne contient que la tuile de départ", () => {
    expect(new Plateau().tuiles).toEqual([Tuile.DE_DEPART]);
  });

  it("les tuiles du plateau ne sont pas modifiables de l'extérieur", () => {
    const tuiles = new Plateau().tuiles as Tuile[];

    expect(() => tuiles.push(Tuile.DE_DEPART)).toThrow(TypeError);
  });
});
