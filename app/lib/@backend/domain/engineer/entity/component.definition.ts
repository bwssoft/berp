export interface IComponent {
  id: string;
  sku: string; //category+variavel
  seq: number;
  category: Component.Category;
  name: string;
  color: string;
  active: boolean;
  created_at: Date;

  spec?: Record<string, string>;
  files?: string[];
  description?: string;
  price?: number;

  measure_unit: Component.Unit;
  manufacturer: Component.Manufacturer[];
}

export namespace Component {
  export interface Category {
    id: string;
    code: string;
  }
  export interface Manufacturer {
    code: string;
    name: string;
  }

  export enum Unit {
    cm = "cm",
    m = "m",
    kg = "kg",
    g = "g",
    ml = "ml",
    l = "l",
    un = "un",
  }
}
