export interface IConfigurationProfile<
  Specific extends E3PlusConfig | E3Plus4GConfig | NB2Config | LoraConfig =
    | E3PlusConfig
    | E3Plus4GConfig
    | NB2Config
    | LoraConfig,
> {
  id: string;
  name: string;
  type: EType;
  config: Config<Specific>;
  created_at: Date;
  user_id: string;
  validation: Validation;
  technology_id: string;
  client_id?: string;
}

export interface Config<Specific> {
  general?: GeneralConfig;
  specific?: Specific;
}

interface Validation {
  by_human: boolean;
  by_system: boolean;
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

type DNS = {
  address: string;
  port: number;
};

type IP = {
  ip: string;
  port: number;
};

type APN = {
  address: string;
  user: string;
  password?: string | undefined;
};

type GeneralConfig = {
  ip_primary?: IP | undefined;
  ip_secondary?: IP | undefined;
  dns_primary?: DNS | undefined;
  dns_secondary?: DNS | undefined;
  apn?: APN | undefined;
  data_transmission_on?: number | undefined;
  data_transmission_off?: number | undefined;
  keep_alive?: number | undefined;
};

export type E3PlusConfig = {
  password?:
    | {
        old?: string | undefined;
        new?: string | undefined;
      }
    | undefined;
  timezone?: number | undefined;
  lock_type?: number | undefined;
  odometer?: number | undefined;
  accelerometer_sensitivity?: number | undefined;
  economy_mode?: number | undefined;
  sensitivity_adjustment?: number | undefined;
  lbs_position?: boolean | undefined;
  cornering_position_update?: boolean | undefined;
  ignition_alert_power_cut?: boolean | undefined;
  gprs_failure_alert?: boolean | undefined;
  led?: boolean | undefined;
  virtual_ignition?: boolean | undefined;
  work_mode?: string | undefined;
  operation_mode?: boolean | undefined;
  optional_functions?: Record<string, boolean> | undefined;
  max_speed?: number | undefined;
  sleep?: number | undefined;
};

export type E3Plus4GConfig = {
  password?:
    | {
        old?: string | undefined;
        new?: string | undefined;
      }
    | undefined;
  timezone?: number | undefined;
  lock_type?: number | undefined;
  odometer?: number | undefined;
  economy_mode?: number | undefined;
  sensitivity_adjustment?: number | undefined;
  lbs_position?: boolean | undefined;
  cornering_position_update?: boolean | undefined;
  led?: boolean | undefined;
  virtual_ignition?: boolean | undefined;
  virtual_ignition_by_voltage?: boolean | undefined;
  virtual_ignition_by_movement?: boolean | undefined;
  optional_functions?: Record<string, boolean>;
  max_speed?: number | undefined;
  communication_type?: string | undefined;
  protocol_type?: string | undefined;
  anti_theft?: boolean | undefined;
  horimeter?: number | undefined;
  jammer_detection?: boolean | undefined;
  clear_buffer?: boolean | undefined;
  clear_horimeter?: boolean | undefined;
  input_1?: number | undefined;
  input_2?: number | undefined;
  angle_adjustment?: number | undefined;
  lock_type_progression?: {
    n1: number | undefined;
    n2: number | undefined;
  };
  ignition_by_voltage?: {
    initial: number | undefined;
    final: number | undefined;
  };
  ack?: number | undefined;
  ignition_status_hb?: boolean | undefined;
};

export type NB2Config = {
  data_transmission_event?: number | undefined;
  time_to_sleep?: number | undefined;
  odometer?: number | undefined;
  virtual_ignition_12v?:
    | { initial: number | undefined; final: number }
    | undefined;
  virtual_ignition_24v?:
    | { initial: number | undefined; final: number }
    | undefined;
  heading_detection_angle?: number | undefined;
  speed_alert_threshold?: number | undefined;
  accel_threshold_for_ignition_on?: number | undefined;
  accel_threshold_for_ignition_off?: number | undefined;
  accel_threshold_for_movement?: number | undefined;
  harsh_acceleration_threshold?: number | undefined;
  harsh_braking_threshold?: number | undefined;
  input_1?: number | undefined;
  input_2?: number | undefined;
  input_3?: number | undefined;
  input_4?: number | undefined;
  full_configuration_table?: string | undefined;
  full_functionality_table?: string | undefined;
  sleep_mode?: string | undefined;
};

export type LoraConfig = {
  odometer?: number | undefined;
  data_transmission_sleep?: number | undefined;
  virtual_ignition_12v?:
    | { initial: number | undefined; final: number }
    | undefined;
  virtual_ignition_24v?:
    | { initial: number | undefined; final: number }
    | undefined;
  heading?: boolean | undefined;
  heading_event_mode?: boolean | undefined;
  heading_detection_angle?: number | undefined;
  speed_alert_threshold?: number | undefined;
  accel_threshold_for_ignition_on?: number | undefined;
  accel_threshold_for_ignition_off?: number | undefined;
  accel_threshold_for_movement?: number | undefined;
  harsh_acceleration_threshold?: number | undefined;
  harsh_braking_threshold?: number | undefined;
  data_transmission_position?: number | undefined;
  led_lighting?: string | undefined;
  p2p_mode_duration?: number | undefined;
  lorawan_mode_duration?: number | undefined;
  input_1?: string | undefined;
  input_2?: string | undefined;
  input_3?: string | undefined;
  input_4?: string | undefined;
  input_5?: string | undefined;
  input_6?: string | undefined;
  full_configuration_table?: string | undefined;
  fifo_send_and_hold_times?: number[] | undefined;
  lorawan_data_transmission_event?: number | undefined;
  p2p_data_transmission_event?: number | undefined;
  data_transmission_status?: number | undefined;
  full_functionality_table?: string | undefined;
  activation_type?: string | undefined;
  mcu_configuration?: string | undefined;
  output_table?: number[] | undefined;
};
