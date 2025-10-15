import { Base } from "@/backend/domain/logistic/entity/base.entity";

const type: { [key in Base.Type]: string } = {
  STOCK: "Estoque",
  WAREHOUSE: "Almoxarifado",
  PRODUCTION: "Produção",
  SHIPMENT: "Expedição",
};

export const baseConstants = {
  type,
};
