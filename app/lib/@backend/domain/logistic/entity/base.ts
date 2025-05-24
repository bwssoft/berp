export interface IBase {
  id: string;
  name: string;
  type: Base.Type;
  enterprise: Base.Enterprise;
  description?: string;
  created_at: Date;
}

namespace Base {
  export interface Enterprise {
    id: string;
    short_name: string;
  }
  export enum Type {
    STOCK = "STOCK",
    WAREHOUSE = "WAREHOUSE",
    SHIPMENT = "SHIPMENT",
    PRODUCTION = "PRODUCTION",
  }
}
