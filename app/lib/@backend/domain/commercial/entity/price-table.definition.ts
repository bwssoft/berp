export type StatusPriceTable = "ativa" | "inativa";

export interface IPriceTable {
  id?: string;
  name: string;
  startDateTime: Date;
  status?: StatusPriceTable;
  endDateTime: Date;
  isTemporary: boolean;
  conditionGroupIds: string[];
  enabledProductsIds: string[];
  created_at?: Date;
  updated_at?: Date;
}
