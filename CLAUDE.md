# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dragomino board game core: a minimal DDD foundation, TypeScript on Node (ESM, no framework). Code, identifiers, error messages and docs are in **French** (`Partie`, `Joueur`, `Tuile`, `Plateau`, `Paysage`); keep new code in French to match.

## Commands

```bash
npm install
npm test                      # full suite (vitest)
npx vitest run Partie         # tests matching a name
npm run typecheck             # tsc --noEmit (strict)
npm run build                 # emit to dist/
npm start -- Alice Bob        # run the CLI (no args = interactive prompts)
```

## Architecture

Two layers, no dependency from `domaine` to `application`:

- `src/domaine/` holds the business rules.
  - `ArgumentInvalideError`: a business rule violated by an argument. No runtime null checks: strict typing is the guard.
  - `common/`: `Paysage` (const object + union type: DESERT, VOLCAN, PRAIRIE), `Tuile` (immutable via `readonly`, two `Paysage`, constant `Tuile.DE_DEPART` = desert/volcan), `Plateau` (starts with only `DE_DEPART`, exposes a frozen array through the `tuiles` getter).
  - `personne/`: `Personne` (immutable, non-blank name).
  - `partie/`: `Joueur` = a `Personne` plus its own `Plateau` (`new Joueur(personne)`, readonly properties). `Partie` is the aggregate; `new Partie(personnes)` builds one `Joueur` per `Personne` (`joueurs` getter, `joueurDe` method). Persons are compared by value, so the internal map is keyed by `nom`.
- `src/application/Dragomino.ts`: CLI logic (`main`, `initialiser`, `saisirNoms`, `resume`). `src/main.ts` is the thin entry point that sets the exit code.

Invariants live in the domain: 2 to 4 players, non-empty name, no duplicate `Personne`. `main` only catches `ArgumentInvalideError`, prints error + usage on stderr, returns exit code 1. The 2 and 4 bounds are duplicated in `Dragomino.ts` only to drive the interactive prompt loop.

Output: `journal` (stdout for info, stderr for errors, bare messages). Interactive prompts are written directly to the `Writable` passed to `saisirNoms`; input is read through the `LecteurDeLignes` interface so tests can drive it from a string.

Out of scope so far: placing tiles, drawing, scoring, turns.

## Working conventions

- Test first. Tests are vitest, colocated as `*.test.ts` next to the source.
- `docs/` is git-ignored.
