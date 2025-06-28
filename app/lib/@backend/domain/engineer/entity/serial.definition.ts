import { Device } from "./device.definition";

export interface ISerial {
  serial: string;
  imei: string;
  model: Device.Model;
}
