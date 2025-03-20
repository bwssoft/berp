export type DeviceIdentificationCommand = {
  request: string;
  response?: string;
};

export type DeviceIdentificationMetadata = {
  init_time: number;
  end_time: number;
  commands: DeviceIdentificationCommand[];
};

export interface IDeviceIdentificationLog {
  id: string;
  equipment: {
    imei: string;
    firmware: string;
    iccid?: string;
    serial?: string;
  };
  technology: {
    id: string;
    name: string;
  };
  current_id?: string;
  is_successful: boolean;
  metadata: DeviceIdentificationMetadata;
  created_at: Date;
  user_id: string;
}
