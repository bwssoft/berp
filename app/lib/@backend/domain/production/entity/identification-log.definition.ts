import { Device } from "../../engineer";
import { IDeviceLog } from "./device-log.definition";

export interface IIdentificationLog extends IDeviceLog {
  identification?: {
    imei?: string;
    serial?: string;
    lora_keys?: Device.Equipment["lora_keys"];
  };
}
