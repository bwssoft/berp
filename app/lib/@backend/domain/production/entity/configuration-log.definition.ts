import { IConfigurationProfile } from "../../engineer";

export type ConfigurationCommand = {
  request: string;
  response?: string;
};

export type ConfigurationMetadata = {
  init_time: number; // horário de início do processo
  end_time: number; // horário de término do processo
  commands: ConfigurationCommand[]; // lista de comandos enviados e suas respostas
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
  profile: {
    id: string;
    name: string;
    config: DeviceProfile; // perfil desejado aplicado no dispositivo
  };
  equipment: {
    imei: string;
    et: string;
    iccid?: string;
  };
  technology: {
    id: string;
    name: string;
  };
  // Perfil retornado pelo dispositivo após a configuração (processo de double-check)
  processed_profile?: DeviceProfile;
  // Dados brutos obtidos do dispositivo (ex: resposta dos comandos "CHECK", "CXIP" e "STATUS")
  raw_rofile?: DeviceNativeProfile;
  // Flag que indica se todos os comandos foram aplicados com sucesso
  is_configured: boolean;
  // Agrupa os dados de porta, tempos e comandos enviados durante a configuração
  metadata: ConfigurationMetadata;
  created_at: Date;
  user_id: string;
  double_check: {
    need: boolean;
    has: boolean;
  };
  // Mapeia cada chave do perfil com os valores desejados e os efetivamente aplicados,
  // facilitando a verificação das diferenças (ex: { desired: 60, actual: 0 })
  not_configured: {
    [K in keyof DeviceProfile]?: { value1: any; value2: any };
  };
}
