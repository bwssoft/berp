import { EProductionOrderPriority, EProductionOrderStage } from "../@backend/domain";

const stage: Record<EProductionOrderStage, string> = {
  [EProductionOrderStage.in_approval]: "Em Aprovação",
  [EProductionOrderStage.in_warehouse]: "No Almoxarifado",
  [EProductionOrderStage.to_produce]: "Para Produzir",
  [EProductionOrderStage.producing]: "Produzindo",
  [EProductionOrderStage.completed]: "Finalizada",
};

const stageColors = {
  in_warehouse: "#14b8a6",
  to_produce: "#db2777",
  producing: "#ea580c",
  completed: "#16a34a",
  "No almoxarifado": "#14b8a6",
  "Para Produzir": "#db2777",
  Produzindo: "#ea580c",
  Finalizada: "#16a34a",
};

const priority: Record<EProductionOrderPriority, string> = {
  [EProductionOrderPriority.high]: "Alta",
  [EProductionOrderPriority.medium]: "Média",
  [EProductionOrderPriority.low]: "Baixa",
};

export const productionOrderConstants = {
  stage,
  priority,
  stageColors,
};
