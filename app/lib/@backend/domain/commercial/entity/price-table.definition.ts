export interface IPriceTable {
  id?: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  isTemporary: boolean;
  conditionGroupIds: string[];
  enabledProductsIds: string[];
  created_at?: Date;
  updated_at?: Date;
}
