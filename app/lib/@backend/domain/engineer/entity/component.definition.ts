export interface IComponent {
  id: string;
  seq: number;
  name: string;
  category: Component.Category;
  measure_unit: Component.Unit;
  // manufacturer: Component.Manufacturer[];
  color: string;
  created_at: Date;
  spec: Record<string, string>;
  files?: string[];
  description?: string;
  price?: number;
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
