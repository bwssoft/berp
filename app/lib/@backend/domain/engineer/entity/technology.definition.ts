import { Device } from "./device.definition";

export interface ITechnology {
  id: string;
  name: {
    brand: string;
    system: Device.Model;
    // DM_E3_PLUS = "DM_E3_PLUS",
    // DM_E3_PLUS_4G = "DM_E3_PLUS_4G",
  };
}
