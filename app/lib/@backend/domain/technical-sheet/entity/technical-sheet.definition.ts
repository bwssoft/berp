export interface ITechnicalSheet {
  id: string;
  name: string;
  inputs: { uuid: string; quantity: number }[];
  product_id: string;
  created_at: Date;
}
