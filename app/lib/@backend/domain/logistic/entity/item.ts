export interface IItem {
  id: string;
  type: Item.Type;
  ref: Item.Ref;
  description?: string;
  created_at: Date;
}

namespace Item {
  export interface Ref {
    id: string;
    name: string;
    code: string;
  }
  export enum Type {
    PRODUCT = "PRODUCT",
    INPUT = "INPUT",
  }
}
