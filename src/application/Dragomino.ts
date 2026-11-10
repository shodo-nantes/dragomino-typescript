import { createInterface } from "node:readline";
import type { Writable } from "node:stream";
import { ArgumentInvalideError } from "../domaine/ArgumentInvalideError.js";
import type { Tuile } from "../domaine/common/Tuile.js";
import { Joueur } from "../domaine/partie/Joueur.js";
import { Partie } from "../domaine/partie/Partie.js";
import { Personne } from "../domaine/personne/Personne.js";

const NOMBRE_MINIMUM_DE_JOUEURS = 2;
const NOMBRE_MAXIMUM_DE_JOUEURS = 4;
const USAGE = "Usage : Dragomino [<nom> <nom> [<nom>] [<nom>]]\n(sans argument, les noms sont demandés un par un)";

/** Source de lignes, lues une à une ; `null` signale la fin du flux. */
export interface LecteurDeLignes {
  lireLigne(): Promise<string | null>;
}

/** Sortie console brute : le message seul, les erreurs sur stderr, le reste sur stdout. */
export const journal = {
  info: (message: string) => console.log(message),
  erreur: (message: string) => console.error(message),
};

export function initialiser(...noms: string[]): Partie {
  return new Partie(noms.map((nom) => new Personne(nom)));
}

/**
 * Demande les noms un par un. Une ligne vide termine la saisie une fois le minimum atteint ;
 * elle est refusée avant. La saisie s'arrête seule au maximum, ou à la fin du flux.
 */
export async function saisirNoms(entree: LecteurDeLignes, sortie: Writable): Promise<string[]> {
  const noms: string[] = [];
  while (noms.length < NOMBRE_MAXIMUM_DE_JOUEURS) {
    const minimumAtteint = noms.length >= NOMBRE_MINIMUM_DE_JOUEURS;
    sortie.write(`Nom du joueur ${noms.length + 1}${minimumAtteint ? " (vide pour terminer)" : ""} : `);
    const ligne = await entree.lireLigne();
    if (ligne === null) {
      break;
    }
    const nom = ligne.trim();
    if (nom !== "") {
      noms.push(nom);
    } else if (minimumAtteint) {
      break;
    } else {
      sortie.write(`Un nom est requis (${NOMBRE_MINIMUM_DE_JOUEURS} joueurs minimum).\n`);
    }
  }
  return noms;
}

export function resume(partie: Partie): string {
  const joueurs = partie.joueurs;
  const lignes = joueurs.map(decrireJoueur).join("\n");
  return `Partie initialisée avec ${joueurs.length} joueurs :\n${lignes}`;
}

function decrireJoueur(joueur: Joueur): string {
  const tuiles = joueur.plateau.tuiles.map(decrireTuile).join(", ");
  return `- ${joueur.personne.nom} : ${tuiles}`;
}

function decrireTuile(tuile: Tuile): string {
  return `${tuile.premier}/${tuile.second}`;
}

/** Lecteur de lignes sur l'entrée standard. */
function lecteurStandard(): LecteurDeLignes & { fermer(): void } {
  const rl = createInterface({ input: process.stdin });
  const iterateur = rl[Symbol.asyncIterator]();
  return {
    async lireLigne() {
      const { done, value } = await iterateur.next();
      return done ? null : (value as string);
    },
    fermer: () => rl.close(),
  };
}

/** Point d'entrée : retourne le code de sortie du processus. */
export async function main(args: string[]): Promise<number> {
  try {
    let noms = args;
    if (noms.length === 0) {
      const lecteur = lecteurStandard();
      try {
        noms = await saisirNoms(lecteur, process.stdout);
      } finally {
        lecteur.fermer();
      }
    }
    journal.info(resume(initialiser(...noms)));
    return 0;
  } catch (e) {
    if (e instanceof ArgumentInvalideError) {
      journal.erreur(`Erreur : ${e.message}`);
      journal.erreur(USAGE);
      return 1;
    }
    throw e;
  }
}
