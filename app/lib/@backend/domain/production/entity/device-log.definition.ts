interface Technology {
  id: string;
  system_name: string;
}

interface Equipment {
  serial: string;
  firmware: string;
  imei?: string;
  iccid?: string;
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
  metadata: Metadata;
}

type Message = {
  request: string;
  response?: string;
};

type Metadata = {
  init_time: number;
  end_time: number;
  messages: Message[];
};
