import { IUser } from "../../admin";
import { Device } from "../../engineer";

export interface IIdentificationLog {
  id: string;
  technology: {
    id: string;
    system_name: Device.Model;
  };
  user: Pick<IUser, "id" | "name">;
  status: boolean;
  created_at: Date;
  equipment_before: {
    imei: string;
    serial: string;
    lora_keys?: Device.Equipment["lora_keys"];
  };
  equipment_after: {
    imei: string;
    serial: string;
    lora_keys?: Device.Equipment["lora_keys"];
  };
  messages: {
    key: string;
    request: string;
    response?: string | null;
  }[];
  end_time: number;
  init_time: number;
}
