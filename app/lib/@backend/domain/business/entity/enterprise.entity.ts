export interface IEnterprise {
  id: string
  name: string
  document: string
  tax_regime: TaxRegime
  created_at: Date
}

enum TaxRegime {
  SIMPLES_NACIONAL = "Simples Nacional",
  LUCRO_PRESUMIDO = "Lucro Presumido",
  LUCRO_REAL = "Lucro Real",
  MEI = "MEI",
  ISENTO = "Isento",
  OUTRO = "Outro"
}