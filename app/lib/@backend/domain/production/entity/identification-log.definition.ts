import { IUser } from "@/backend/domain/admin/entity/user.definition";
import { Device } from "@/backend/domain/engineer/entity/device.definition";

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
    serial: string;
    imei?: string;
    lora_keys?: Device.Equipment["lora_keys"];
  };
  equipment_after: {
    serial: string;
    imei?: string;
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
