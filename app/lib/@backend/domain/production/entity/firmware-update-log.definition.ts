import { IUser } from "../../admin";
import { Device } from "../../engineer";

export interface IFirmwareUpdateLog {
  id: string;
  technology: {
    id: string;
    system_name: Device.Model;
  };
  user: Pick<IUser, "id" | "name">;
  status: boolean;
  created_at: Date;
  equipment: {
    serial: string;
    firmware: string;
    imei?: string;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  };
  messages: {
    key: string;
    request: string;
    response?: string | null;
  }[];
  end_time: number;
  init_time: number;
}
