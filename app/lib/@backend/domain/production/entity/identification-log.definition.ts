export type IdentificationCommand = {
  request: string;
  response?: string;
};

export type IdentificationMetadata = {
  init_time: number;
  end_time: number;
  commands: IdentificationCommand[];
};

export interface IIdentificationLog {
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
  metadata: IdentificationMetadata;
  created_at: Date;
}
