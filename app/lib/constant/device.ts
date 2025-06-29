import { Device } from "../@backend/domain";

const model: { [key in Device.Model]: string } = {
  DM_E3: "E3",

  DM_GT06: "GT06",

  DM_E3_PLUS: "E3+",
  DM_E3_PLUS_PERSONAL: "E3+ PERSONAL",
  DM_E3_PLUS_PET: "E3+ PET",
  DM_E3_PLUS_OBD_II: "E3+ OBD",
  DM_E3_PLUS_LONG_LIFE: "E3+ LONG_LIFE",

  DM_E3_PLUS_4G: "E3+4G",
  DM_BWS_NB2: "BWS NB2",
  DM_BWS_LORA: "BWS LoRa",
  DM_BWS_NB2_LORA: "BWS NB2+LoRa",
  DM_BWS_4G: "BWS 4G",
  DM_BWS_PLUS_4G_LORA: "BWS 4G+LoRa",
};

export const deviceConstants = { model };
