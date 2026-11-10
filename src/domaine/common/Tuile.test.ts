import { describe, expect, it } from "vitest";
import { Paysage } from "./Paysage.js";
import { Tuile } from "./Tuile.js";

describe("Tuile", () => {
  it("une tuile a deux paysages", () => {
    const tuile = new Tuile(Paysage.PRAIRIE, Paysage.VOLCAN);

    expect(tuile.premier).toBe(Paysage.PRAIRIE);
    expect(tuile.second).toBe(Paysage.VOLCAN);
  });

  it("une tuile peut avoir deux fois le même paysage", () => {
    expect(new Tuile(Paysage.DESERT, Paysage.DESERT).second).toBe(Paysage.DESERT);
  });

  it("deux tuiles de mêmes paysages sont égales", () => {
    expect(new Tuile(Paysage.DESERT, Paysage.PRAIRIE)).toEqual(new Tuile(Paysage.DESERT, Paysage.PRAIRIE));
  });

  it("la tuile de départ a toujours les paysages désert et volcan", () => {
    expect(Tuile.DE_DEPART).toEqual(new Tuile(Paysage.DESERT, Paysage.VOLCAN));
  });
});
