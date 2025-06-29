import { Base } from "./base.entity";
import { Item } from "./item.entity";

export interface IMovement {
  id: string;
  seq: number;
  item: Movement.Item;
  quantity: number;
  type: Movement.Type;
  base: Movement.Base;
  status: Movement.Status;
  created_at: Date;
  confirmed_at?: Date;
  description?: string;
  related_movement_id?: {
    previous?: string;
    next?: string;
  };
  workflow_id?: string;
}

export namespace Movement {
  export interface Item {
    id: string;
    type: Item.Type;
    ref: {
      id: string;
      sku: string;
      category: { id: string };
    };
  }

  export interface Base {
    id: string;
    sku: string;
    type: Base.Type;
  }

  export enum Type {
    ENTER = "ENTER",
    EXIT = "EXIT",
  }

  export enum Status {
    PENDING = "PENDING",
    CONFIRM = "CONFIRM",
    // CANCELLED = "CANCELLED",
  }
}
