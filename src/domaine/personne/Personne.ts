import { ArgumentInvalideError } from "../ArgumentInvalideError.js";

export class Personne {
  constructor(readonly nom: string) {
    if (nom.trim() === "") throw new ArgumentInvalideError("Le nom d'une personne ne peut pas être vide");
  }
}
