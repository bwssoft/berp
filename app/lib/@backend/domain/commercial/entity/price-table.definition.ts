export type StatusPriceTable = "ativa" | "inativa" | "cancelada" | "aguardando publicação" | "tabela programada para publicação" | "rascunho";

export interface IPriceTable {
  id?: string;
  name: string;
  startDateTime: Date;
  status?: StatusPriceTable;
  endDateTime: Date;
  isTemporary: boolean; // tabela provisoria // tabela normal
  conditionGroupIds: string[];
  enabledProductsIds: string[];
  created_at?: Date;
  updated_at?: Date;
}
