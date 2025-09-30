import type { UF_CODES } from "../uf";
import type { County } from "./sp";

export type { County };

export const loadCountiesByUF = async (uf: UF_CODES): Promise<County[]> => {
  switch (uf) {
    case "SP":
      return (await import("./sp")).COUNTIES_SP;
    case "RJ":
      return (await import("./rj")).COUNTIES_RJ;
    case "MG":
      return (await import("./mg")).COUNTIES_MG;
    case "ES":
      return (await import("./es")).COUNTIES_ES;
    case "PR":
      return (await import("./pr")).COUNTIES_PR;
    case "SC":
      return (await import("./sc")).COUNTIES_SC;
    case "RS":
      return (await import("./rs")).COUNTIES_RS;
    case "BA":
      return (await import("./ba")).COUNTIES_BA;
    case "PE":
      return (await import("./pe")).COUNTIES_PE;
    case "CE":
      return (await import("./ce")).COUNTIES_CE;
    case "PA":
      return (await import("./pa")).COUNTIES_PA;
    case "AM":
      return (await import("./am")).COUNTIES_AM;
    case "RO":
      return (await import("./ro")).COUNTIES_RO;
    case "RR":
      return (await import("./rr")).COUNTIES_RR;
    case "AP":
      return (await import("./ap")).COUNTIES_AP;
    case "AC":
      return (await import("./ac")).COUNTIES_AC;
    case "TO":
      return (await import("./to")).COUNTIES_TO;
    case "MA":
      return (await import("./ma")).COUNTIES_MA;
    case "PI":
      return (await import("./pi")).COUNTIES_PI;
    case "RN":
      return (await import("./rn")).COUNTIES_RN;
    case "PB":
      return (await import("./pb")).COUNTIES_PB;
    case "AL":
      return (await import("./al")).COUNTIES_AL;
    case "SE":
      return (await import("./se")).COUNTIES_SE;
    case "MT":
      return (await import("./mt")).COUNTIES_MT;
    case "MS":
      return (await import("./ms")).COUNTIES_MS;
    case "GO":
      return (await import("./go")).COUNTIES_GO;
    case "DF":
      return (await import("./df")).COUNTIES_DF;
    default:
      return [];
  }
};
