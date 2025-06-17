import { IDeviceLog } from "./device-log.definition";

export interface IIdentificationLog extends IDeviceLog {
  identification?: {
    imei?: string;
    serial?: string;
    lora_keys?: {
      tk: string;
      da: string;
      de: string;
      ap: string;
      ak: string;
      ask: string;
      nk: string;
    };
  };
}
