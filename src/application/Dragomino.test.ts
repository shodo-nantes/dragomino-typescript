import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { ArgumentInvalideError } from "../domaine/ArgumentInvalideError.js";
import { Personne } from "../domaine/personne/Personne.js";
import { initialiser, resume, saisirNoms, type LecteurDeLignes } from "./Dragomino.js";

function lecteur(entree: string): LecteurDeLignes {
  const lignes = entree.split("\n");
  if (lignes.at(-1) === "") lignes.pop();
  let i = 0;
  return { lireLigne: async () => (i < lignes.length ? lignes[i++]! : null) };
}

async function saisir(entree: string) {
  const sortie = new PassThrough();
  const noms = await saisirNoms(lecteur(entree), sortie);
  return { noms, invites: sortie.read()?.toString("utf8") ?? "" };
}

describe("Dragomino", () => {
  it("initialiser crée un joueur par nom dans l'ordre saisi", () => {
    const partie = initialiser("Alice", "Bob", "Chloé");

    expect(partie.joueurs.map((j) => j.personne)).toEqual([
      new Personne("Alice"),
      new Personne("Bob"),
      new Personne("Chloé"),
    ]);
  });

  it("initialiser refuse moins de 2 noms", () => {
    expect(() => initialiser("Alice")).toThrow(ArgumentInvalideError);
  });

  it("initialiser refuse plus de 4 noms", () => {
    expect(() => initialiser("A", "B", "C", "D", "E")).toThrow(ArgumentInvalideError);
  });

  it("initialiser refuse un nom vide", () => {
    expect(() => initialiser("Alice", " ")).toThrow(ArgumentInvalideError);
  });

  it("initialiser refuse un nom en double", () => {
    expect(() => initialiser("Alice", "Alice")).toThrow(ArgumentInvalideError);
  });

  it("la saisie s'arrête sur une ligne vide à partir de 2 noms", async () => {
    expect((await saisir("Alice\nBob\n\nChloé\n")).noms).toEqual(["Alice", "Bob"]);
  });

  it("la saisie s'arrête seule à 4 noms", async () => {
    expect((await saisir("A\nB\nC\nD\nE\n")).noms).toEqual(["A", "B", "C", "D"]);
  });

  it("la saisie refuse une ligne vide avant 2 noms", async () => {
    expect((await saisir("Alice\n\n  \nBob\n\n")).noms).toEqual(["Alice", "Bob"]);
  });

  it("la saisie retire les espaces autour des noms", async () => {
    expect((await saisir("  Alice \nBob\n\n")).noms).toEqual(["Alice", "Bob"]);
  });

  it("la fin de flux termine la saisie", async () => {
    expect((await saisir("Alice\n")).noms).toEqual(["Alice"]);
  });

  it("les invites numérotent les joueurs et précisent quand terminer", async () => {
    const { invites } = await saisir("Alice\nBob\n\n");

    expect(invites).toContain("Nom du joueur 1 :");
    expect(invites).toContain("Nom du joueur 2 :");
    expect(invites).toContain("Nom du joueur 3 (vide pour terminer) :");
  });

  it("le résumé liste chaque joueur avec sa tuile de départ", () => {
    const texte = resume(initialiser("Alice", "Bob"));

    expect(texte).toContain("2 joueurs");
    expect(texte).toContain("Alice : DESERT/VOLCAN");
    expect(texte).toContain("Bob : DESERT/VOLCAN");
  });
});
