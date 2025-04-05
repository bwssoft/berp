import { IConfigurationProfile } from "../../engineer";
import { IDeviceLog } from "./device-log.definition";

export interface IConfigurationLog extends IDeviceLog {
  profile: {
    id: string;
    name: string;
    config: ParsedProfile; // perfil desejado aplicado no dispositivo
  };
  checked: boolean;
  // Mapeia cada chave do perfil com os valores desejados e os efetivamente aplicados,
  // facilitando a verificação das diferenças (ex: { desired: 60, actual: 0 })
  not_configured?: {
    general?: NestedProfileDiff<ParsedProfile["general"]>;
    specific?: NestedProfileDiff<ParsedProfile["specific"]>;
  };
  // Perfil retornado pelo dispositivo após a configuração (processo de double-check)
  parsed_profile?: ParsedProfile;
  // Dados brutos obtidos do dispositivo (ex: resposta dos comandos "CHECK", "CXIP" e "STATUS")
  raw_profile?: [string, string][];
  client?: Client | null;
}

interface Client {
  id: string;
  trade_name: string;
  company_name: string;
  document: string;
}

export type ParsedProfile = IConfigurationProfile["config"];

export type RawProfile = [string, string][]; // [["status", "SN="]]

export type ProfileDiff = { value1: any; value2: any };

type NestedProfileDiff<T> = T extends object
  ? ProfileDiff | { [K in keyof T]?: NestedProfileDiff<T[K]> }
  : ProfileDiff;
