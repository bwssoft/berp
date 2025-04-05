import { IDeviceLog } from "./device-log.definition";

export interface IIdentificationLog extends IDeviceLog {
  identification?: {
    imei?: string;
    serial?: string;
  };
}
