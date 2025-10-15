import { Device } from "@/backend/domain/engineer/entity/device.definition";

interface Technology {
  id: string;
  system_name: Device.Model;
}

interface Equipment {
  serial: string;
  firmware: string;
  imei?: string;
  iccid?: string;
  lora_keys?: Partial<Device.Equipment["lora_keys"]>;
}

interface User {
  id: string;
  name: string;
}

export interface IDeviceLog {
  id: string;
  equipment: Equipment;
  technology: Technology;
  user: User;
  status: boolean;
  created_at: Date;
}
