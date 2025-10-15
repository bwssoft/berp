import { BwsNb2 } from "@/backend/infra/protocol/parser/nb-2";

const autoTestAnalisys: { [key in keyof BwsNb2.AutoTest]?: string } = {
  ACELC: "ACELC",
  ACELP: "ACELP",
  BATT_VOLT: "BATT_VOLT",
  CHARGER: "CHARGER",
  FW: "FW",
  GPS: "GPS",
  GPSf: "GPSf",
  IC: "IC",
  ID_ACEL: "ID_ACEL",
  ID_MEM: "ID_MEM",
  IM: "IM",
  IN1: "IN1",
  IN2: "IN2",
  MDM: "MDM",
  OUT: "OUT",
  RSI: "RSI",
  SN: "SN",
  VCC: "VCC",
};

export const autoTestBwsNb2 = {
  autoTestAnalisys,
};
