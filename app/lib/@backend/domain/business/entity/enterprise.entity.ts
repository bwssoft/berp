export interface IEnterprise {
  id: string;
  document: string;
  name: Enterprise.Name;
  tax_regime: Enterprise.TaxRegime;
  created_at: Date;
}

namespace Enterprise {
  export interface Name {
    fantasy: string;
    legal: string;
    short: string;
  }

  export enum TaxRegime {
    SIMPLES_NACIONAL = "SIMPLES_NACIONAL",
    LUCRO_PRESUMIDO = "LUCRO_PRESUMIDO",
    LUCRO_REAL = "LUCRO_REAL",
    MEI = "MEI",
    ISENTO = "ISENTO",
    OUTRO = "OUTRO",
  }
}
