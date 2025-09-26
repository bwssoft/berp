import type { UF_CODES } from "../../../../../consts/uf";

export type County = { nome: string; ibge: number; uf: UF_CODES };

export const COUNTIES_DF: County[] = [
  {
    nome: "Brasília",
    ibge: 5300108,
    uf: "DF",
  },
];
