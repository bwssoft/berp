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
  before: {
    imei: string;
    serial: string;
  };
  after?: {
    imei?: string;
    serial?: string;
  };
  technology: {
    id: string;
    system_name: string;
  };
  user: {
    id: string;
    name: string;
  };
  status: boolean;
  metadata: DeviceIdentificationMetadata;
  created_at: Date;
}
