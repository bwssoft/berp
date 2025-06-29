import { Item } from "./item.entity";
import { Base } from "./base.entity";

export interface IStock {
  id: string;
  base: Stock.Base;
  item: Stock.Item;
  quantity: number;
  updated_at: Date;
  created_at: Date;
}

namespace Stock {
  export interface Item {
    id: string;
    type: Item.Type;
    ref: {
      id: string;
      name: string;
      sku: string;
      color: string;
      category: { id: string };
    };
  }

  export interface Base {
    id: string;
    sku: string;
    type: Base.Type;
  }
}
