export interface IPriceRange {
  from: number;
  to: number;
  unitPrice: number;
}

export interface IEquipmentPayment {
  type: "batch" | "unit";
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

export interface IPriceTableProduct {
  id?: string; // PK
  productId: string; // ref: Product.id
  equipmentPaymentOnSight?: IEquipmentPayment;
  equipmentPaymentOnDemand?: IEquipmentPayment;
  simcardPayment?: ISimcardPayment[];
  servicePayment?: IServicePayment[];
  created_at?: Date;
  updated_at?: Date;
}
