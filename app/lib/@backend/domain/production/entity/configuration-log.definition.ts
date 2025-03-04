import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";
import { IConfigurationProfile } from "../../engineer";

export type ConfigurationMetadata = {
  port: ISerialPort;
  init_time_configuration: number;
  end_time_configuration: number;
  commands_sent: {
    request: string;
    response?: string;
  }[];
};
export type DeviceProfile = IConfigurationProfile["config"];
export type DeviceNativeProfile = {
  check?: string;
  dns?: string;
  cxip?: string;
  status?: string;
};

export interface IConfigurationLog {
  id: string;
  imei: string;
  iccid?: string;
  et: string;
  desired_profile: DeviceProfile;
  actual_profile?: DeviceProfile;
  actual_native_profile?: DeviceNativeProfile;
  is_configured: boolean;
  not_configured: {
    [key in keyof DeviceProfile]: { value1: any; value2: any };
  };
  metadata: ConfigurationMetadata;
  profile_id: string;
  profile_name: string;
  created_at: Date;
  user_id: string;
  technology_id: string;
  need_double_check: boolean;
  has_double_check: boolean;
}
