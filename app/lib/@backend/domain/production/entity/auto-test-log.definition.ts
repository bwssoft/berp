import { E34G, NB2 } from "../../../infra/protocol";

export type AutoTestCommand = {
  request: string;
  response?: string;
};

export type AutoTestMetadata = {
  init_time: number;
  end_time: number;
  commands: AutoTestCommand[];
};

type Analysis = {
  [K in keyof NB2.AutoTest | keyof E34G.AutoTest]?: boolean;
};

export interface IAutoTestLog {
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
  is_successful: boolean;
  metadata: AutoTestMetadata;
  analysis: Analysis;
  created_at: Date;
  user_id: string;
}
