export interface ITechnicalSheet {
  id: string;
  name: string;
  inputs: { input_uuid: string; quantity: number }[];
  product_id: string;
}
