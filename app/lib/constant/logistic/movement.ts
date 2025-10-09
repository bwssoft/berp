import { Movement } from "@/backend/domain/logistic/entity/movement.entity";

const type: { [key in Movement.Type]: string } = {
  ENTER: "Entrada",
  EXIT: "Saída",
};

const status: { [key in Movement.Status]: string } = {
  CONFIRM: "Confirmado",
  PENDING: "Pendente",
  // CANCELLED: "Cancelado",
};

export const movementConstants = {
  type,
  status,
};
