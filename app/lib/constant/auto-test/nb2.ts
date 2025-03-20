import { NB2 } from "../../@backend/infra/protocol";

const autoTestAnalisys: { [key in keyof NB2.AutoTest]?: string } = {
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

export const autoTestNB2 = {
  autoTestAnalisys,
};
