import { E34G } from "@/backend/infra/protocol/parser/E34G";

const autoTestAnalisys: { [key in keyof E34G.AutoTest]?: string } = {
  SIMHW: "Iccid",
  GPS: "Gps",
  IN1: "Input 1",
  IN2: "Input 2",
  OUT: "Output",
  ACELP: "Acel",
  VCC: "Vcc",
  CHARGER: "Bateria",
  MEM: "Memória",
};

export const autoTestE3Plus4G = {
  autoTestAnalisys,
};
