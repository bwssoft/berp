import { Base } from "./base";

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
}

export namespace Movement {
  export interface Item {
    id: string;
    ref: {
      id: string;
      code: string;
    };
  }

  export interface Base {
    id: string;
    code: string;
    type: Base.Type;
  }

  export enum Type {
    ENTER = "ENTER",
    EXIT = "EXIT",
  }

  export enum Status {
    PENDING = "PENDING",
    CONFIRM = "CONFIRM",
  }
}
