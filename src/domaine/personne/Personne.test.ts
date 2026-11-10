import { describe, expect, it } from "vitest";
import { ArgumentInvalideError } from "../ArgumentInvalideError.js";
import { Personne } from "./Personne.js";

describe("Personne", () => {
  it("une personne a un nom", () => {
    expect(new Personne("Alice").nom).toBe("Alice");
  });

  it("une personne au nom vide est refusée", () => {
    expect(() => new Personne("  ")).toThrow(ArgumentInvalideError);
  });
});
