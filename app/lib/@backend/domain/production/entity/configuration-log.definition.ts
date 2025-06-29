import { IConfigurationProfile } from "../../engineer";
import { IDeviceLog } from "./device-log.definition";

/**
 * Log entry for a configuration profile change, extending the base device log.
 */
export interface IConfigurationLog extends IDeviceLog {
  /** Desired configuration object, if available. */
  desired_profile: Pick<IConfigurationProfile, "id" | "name" | "config">;

  /** Parsed configuration object, if available. */
  applied_profile?: IConfigurationProfile["config"];

  /** Whether the configuration has been checked. */
  checked: boolean;

  checked_at?: Date;

  messages: {
    key: string;
    request: string;
    response?: string | null;
  }[];

  init_time: number;
  end_time: number;
}
