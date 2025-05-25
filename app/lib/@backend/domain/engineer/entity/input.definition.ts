export interface IInput {
  id: string;
  sku: string; //category+variavel
  seq: number;
  category: Input.Category;
  name: string;
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
