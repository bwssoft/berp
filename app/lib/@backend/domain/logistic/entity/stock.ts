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
    ref: {
      name: string;
      code: string;
    };
  }

  export interface Base {
    id: string;
    code: string;
  }
}
