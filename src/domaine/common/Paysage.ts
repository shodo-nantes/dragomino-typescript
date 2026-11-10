export const Paysage = {
  DESERT: "DESERT",
  VOLCAN: "VOLCAN",
  PRAIRIE: "PRAIRIE",
} as const;

export type Paysage = (typeof Paysage)[keyof typeof Paysage];
