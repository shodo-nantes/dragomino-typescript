/** Une règle métier est violée par un argument. */
export class ArgumentInvalideError extends Error {
  override readonly name = "ArgumentInvalideError";
}
