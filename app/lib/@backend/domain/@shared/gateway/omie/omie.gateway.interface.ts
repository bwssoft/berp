export type OmieResponse = {
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
};

export type OmieBoolean = "S" | "N";

export type OmieDefaultParams = {
  pagina: number;
  registros_por_pagina: number;
  apenas_importado_api: "N";
  ordenar_por?: string;
};

export type OmieCredentials = {
  app_key: string;
  app_secret: string;
};

export type OmieSearchParams = Omit<OmieDefaultParams, "apenas_importado_api">;

export type OmieCallFunctions = "ConsultarPedido" | "ListarAnexo";

export enum OmieEnterpriseEnum {
  MGC = "MGC",
  BWS = "BWS",
  ICB = "ICB",
  ICBFILIAL = "ICBFILIAL",
  WFC = "WFC",
}
