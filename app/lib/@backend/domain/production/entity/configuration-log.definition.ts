import { IConfigurationProfile } from "../../engineer";

export type ConfigurationCommand = {
  request: string;
  response?: string;
};

export type ConfigurationMetadata = {
  init_time: number;
  end_time: number;
  commands: ConfigurationCommand[];
};

export type ParsedProfile = IConfigurationProfile["config"];

export type RawProfile = [string, string][]; // [["status", "SN="]]

export interface IConfigurationLog {
  id: string;
  profile: {
    id: string;
    name: string;
    config: ParsedProfile; // perfil desejado aplicado no dispositivo
  };
  equipment: {
    imei: string;
    serial: string;
    firmware: string;
    iccid?: string;
  };
  technology: {
    id: string;
    system_name: string;
  };
  user: {
    id: string;
    name: string;
  };
  checked: boolean;
  // Mapeia cada chave do perfil com os valores desejados e os efetivamente aplicados,
  // facilitando a verificação das diferenças (ex: { desired: 60, actual: 0 })
  not_configured?: {
    general?: {
      [K in keyof ParsedProfile["general"]]?: { value1: any; value2: any };
    };
    specific?: {
      [K in keyof ParsedProfile["specific"]]?: { value1: any; value2: any };
    };
  };
  // Perfil retornado pelo dispositivo após a configuração (processo de double-check)
  parsed_profile?: ParsedProfile;
  // Dados brutos obtidos do dispositivo (ex: resposta dos comandos "CHECK", "CXIP" e "STATUS")
  raw_profile?: [string, string][];
  // Flag que indica se todos os comandos foram aplicados com sucesso
  status: boolean;
  // Agrupa os dados de porta, tempos e comandos enviados durante a configuração
  metadata: ConfigurationMetadata;
  created_at: Date;
}
