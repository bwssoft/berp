export interface IMovement {
  id: string;
  item: Movement.Item;
  quantity: number;
  type: Movement.Type;
  origin_base: Movement.Base;
  destination_base: Movement.Base;
  status: Movement.Status;
  created_at: Date;
  confirmed_at?: Date;
  description?: string;
}

namespace Movement {
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

  export enum Type {
    ENTER = "ENTER",
    EXIT = "EXIT",
    TRANSFER = "TRANSFER",
    ADJUSTMENT = "ADJUSTMENT",
  }

  export enum Status {
    PENDING = "PENDING",
    CONFIRM = "CONFIRM",
  }
}
