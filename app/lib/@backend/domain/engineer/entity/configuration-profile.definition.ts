export interface IConfigurationProfile {
  id: string;
  client_id: string;
  use_case: EUseCase;
  name: string;
  type: EType;
  config: Config;
  optional_functions?: Record<string, boolean>;
  created_at: Date;
  user_id: string;
  technology_id: string;
  validation: Validation;
}

interface Validation {
  by_human: boolean;
  by_system: boolean;
}

export enum EUseCase {
  CLIENT = "CLIENT",
  INTERNAL = "INTERNAL",
}

export enum EType {
  HUMAN = "HUMAN",
  TRUCK = "TRUCK",
  MOTORCYCLE = "MOTORCYCLE",
  STUFF = "STUFF",
  BOAT = "BOAT",
  CAR = "CAR",
  BUS = "BUS",
  UTILITY_VEHICLE = "UTILITY_VEHICLE",
  BIKE = "BIKE",
  ANIMAL = "ANIMAL",
  ROAD_IMPLEMENT = "ROAD_IMPLEMENT",
  FARM_IMPLEMENT = "FARM_IMPLEMENT",
  JET = "JET",
  JET_SKI = "JET_SKI",
  AIRCRAFT = "AIRCRAFT",
  OTHER = "OTHER",
}

type Config = {
  password?: {
    old?: string;
    new?: string;
  };
  ip?: {
    primary?: {
      ip?: string;
      port?: number;
    };
    secondary?: {
      ip?: string;
      port?: number;
    };
  };
  dns?: {
    address?: string;
    port?: number;
  };
  apn?: {
    address?: string;
    user?: string;
    password?: string;
  };
  data_transmission?: {
    on?: number;
    off?: number;
  };
  timezone?: number;
  lock_type?: number;
  odometer?: number;
  keep_alive?: number;
  accelerometer_sensitivity?: number;
  economy_mode?: number;
  lbs_position?: boolean;
  cornering_position_update?: boolean;
  ignition_alert_power_cut?: boolean;
  gprs_failure_alert?: boolean;
  led?: boolean;
  virtual_ignition?: boolean;
  sensitivity_adjustment?: number;
  work_mode?: string;
  operation_mode?: boolean;
  sleep?: number;
  max_speed?: number;

  virtual_ignition_by_voltage?: boolean;
  virtual_ignition_by_movement?: boolean;
  communication_type?: string;
  protocol_type?: string;
  anti_theft?: boolean;
  horimeter?: number;
  jammer_detection?: boolean;
  clear_buffer?: boolean;
  clear_horimeter?: boolean;
  input_1?: number;
  input_2?: number;
  angle_adjustment?: number;
  lock_type_progression?: {
    n1: number;
    n2: number;
  };
  ignition_by_voltage?: {
    t1: number;
    t2: number;
  };
  ack?: number;
  ignition_status_hb?: boolean;
};
