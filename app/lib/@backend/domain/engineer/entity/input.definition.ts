export interface IInput {
  id: string;
  seq: number;
  name: string;
  category: Input.Category;
  color: string;
  active: boolean;
  created_at: Date;

  spec?: Record<string, string>;
  files?: string[];
  description?: string;
  price?: number;

  updated_at?: Date;
}

export namespace Input {
  export type Category = {
    id: string;
    code: string;
  };
}
