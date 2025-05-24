export interface IBase {
  id: string;
  code: string;
  type: Base.Type;
  enterprise: Base.Enterprise;
  description?: string;
  created_at: Date;
  active: boolean;
}

export namespace Base {
  export interface Enterprise {
    id: string;
    name: {
      short: string;
    };
  }
  export enum Type {
    STOCK = "STOCK",
    WAREHOUSE = "WAREHOUSE",
    SHIPMENT = "SHIPMENT",
    PRODUCTION = "PRODUCTION",
  }
}
