import { IComponent } from "@/backend/domain/engineer/entity/component.definition";

//objeto para mapear o titulo dos cards nos insights dos forms de produto
interface Merged {
  input: IComponent;
  color: string;
  name: string;
  price: number;
  total: number;
  quantity: number;
}

const statsMapped = {
  maxQuantity: (input: Merged) => `Maior quantidade (${input.quantity})`,
  minQuantity: (input: Merged) => `Menor quantidade (${input.quantity})`,
  maxPrice: (input: Merged) =>
    `Maior preço unitário (R$ ${input.price.toFixed(2)})`,
  minPrice: (input: Merged) =>
    `Menor preço unitário (R$ ${input.price.toFixed(2)})`,
  maxTotal: (input: Merged) =>
    `Maior preço agregado (R$ ${input.total.toFixed(2)})`,
  minTotal: (input: Merged) =>
    `Menor preço agregado (R$ ${input.total.toFixed(2)})`,
};

export const productConstants = {
  statsMapped,
};
