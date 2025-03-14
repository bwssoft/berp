import { AutoTest } from "../../../infra/protocol";

export type AutoTestCommand = {
  request: string;
  response?: string;
};

export type AutoTestMetadata = {
  init_time: number;
  end_time: number;
  commands: AutoTestCommand[];
};

export interface IAutoTestLog {
  id: string;
  equipment: {
    imei: string;
    et: string;
    iccid?: string;
  };
  technology: {
    id: string;
    name: string;
  };
  is_successful: boolean;
  metadata: AutoTestMetadata;
  analysis: { [key in keyof AutoTest]?: boolean };
  created_at: Date;
  user_id: string;
}
