import { IProduct } from "./product.definition";

interface IDevice {
  id: string;
  equipment: Device.Equipment;
  model: Device.Model;
  created_at: Date;
  identified_at?: Date;
  simcard?: Device.Simcard;
}

namespace Device {
  export interface Equipment {
    serial: string;
    firmware: string;
    imei?: string;
  }

  export interface Simcard {
    iccid?: string;
    msisdn?: string;
  }

  export enum Model {
    DM_E3_PLUS = "DM_E3_PLUS",
    DM_E3_PLUS_PERSONAL = "DM_E3_PLUS_PERSONAL",
    DM_E3_PLUS_PET = "DM_E3_PLUS_PET",
    DM_E3_PLUS_OBD_II = "DM_E3_PLUS_OBD_II",
    DM_E3_PLUS_LONG_LIFE = "DM_E3_PLUS_LONG_LIFE",
    DM_E3 = "DM_E3",
    DM_GT06 = "DM_GT06",
    DM_E3_PLUS_4G = "DM_E3_PLUS_4G",
    DM_BWS_PLUS_4G_LORA = "DM_BWS_PLUS_4G_LORA",
    DM_BWS_NB2 = "DM_BWS_NB2",
    DM_BWS_NB2_LORA = "DM_BWS_NB2_LORA",
    DM_BWS_LORA = "DM_BWS_LORA",
  }

  export interface Product extends Pick<IProduct, "name" | "technology_id"> {}
}

export { type IDevice, Device };
