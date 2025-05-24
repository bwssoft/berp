import { Movement } from "../../@backend/domain";

const type: { [key in Movement.Type]: string } = {
  ENTER: "Entrada",
  EXIT: "Saída",
};

const status: { [key in Movement.Status]: string } = {
  CONFIRM: "Confirmado",
  PENDING: "Pendente",
};

export const movementConstants = {
  type,
  status,
};
