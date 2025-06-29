export interface IItem {
  id: string;
  type: Item.Type;
  ref: Item.Ref;
  created_at: Date;
}

export namespace Item {
  export interface Ref {
    id: string; // relação com input ou product ou component
    sku: string;
    name: string;
    color: string;
    category: { id: string };
  }
  export enum Type {
    PRODUCT = "PRODUCT",
    INPUT = "INPUT",
    COMPONENT = "COMPONENT",
  }
}
