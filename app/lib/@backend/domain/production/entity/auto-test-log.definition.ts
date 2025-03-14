import { AutoTest } from "../../../infra/protocol";

export type AutoTestCommand = {
  request: string;
  response?: string;
};

export type AutoTestMetadata = {
  init_time: number; // horário de início do processo
  end_time: number; // horário de término do processo
  commands: AutoTestCommand[]; // lista de comandos enviados e suas respostas
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
