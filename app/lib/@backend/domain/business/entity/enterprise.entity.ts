export interface IEnterprise {
  id: string
  legal_name: string
  short_name: string
  document: string
  tax_regime: TaxRegime
  created_at: Date
}

enum TaxRegime {
  SIMPLES_NACIONAL = "SIMPLES_NACIONAL",
  LUCRO_PRESUMIDO = "LUCRO_PRESUMIDO",
  LUCRO_REAL = "LUCRO_REAL",
  MEI = "MEI",
  ISENTO = "ISENTO",
  OUTRO = "OUTRO"
}