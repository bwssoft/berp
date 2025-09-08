export type StatusPriceTable =
  | "ACTIVE"
  | "INACTIVE"
  | "CANCELLED"
  | "AWAITING_PUBLICATION"
  | "SCHEDULED_FOR_PUBLICATION"
  | "DRAFT";

export interface IPriceTable {
  id?: string;
  name: string;
  startDateTime: Date;
  status?: StatusPriceTable;
  endDateTime: Date;
  isTemporary: boolean; // tabela provisoria // tabela normal
  conditionGroupIds: string[];
  enabledProductsIds: string[];
  equipmentPayment?: IEquipmentPayment[];
  simcardPayment?: ISimcardPayment[];
  servicePayment?: IServicePayment[];
  created_at?: Date;
  updated_at?: Date;
}
export interface IPriceRange {
  from: number;
  to: number;
  unitPrice: number;
}

export interface IEquipmentPayment {
  type: "batch" | "unit";
  productId: string; // ref: Product.id
  productName: string; // ref: Product.name
  unitPrice: number;
  priceRange: IPriceRange[];
}

export interface ISimcardPayment {
  carriers: string[];
  dataAmountMb: number;
  planType: string;
  provider: string;
  priceWithoutDevice: number;
  priceInBundle: number;
}

export interface IServicePayment {
  serviceId: string; // ref: Service.id
  monthlyPrice?: number;
  yearlyPrice?: number;
  fixedPrice?: number;
}
