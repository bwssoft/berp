import { IUser } from "@/backend/domain/admin/entity/user.definition";
import { Device } from "@/backend/domain/engineer/entity/device.definition";

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
