const stage = {
  in_warehouse: "No almoxarifado",
  to_produce: "Para Produzir",
  producing: "Produzindo",
  completed: "Finalizada",
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

const priority = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export const productionOrderConstants = {
  stage,
  priority,
  stageColors,
};
