import { IConfigurationProfile } from "../../@backend/domain";
import { configurationProfileE3Plus } from "./e3-plus";
import { configurationProfileE3Plus4G } from "./e3-plus-4g";

const type: { [key in IConfigurationProfile["type"]]: string } = {
  BOAT: "Barco",
  CAR: "Carro",
  BUS: "Ônibus",
  MOTORCYCLE: "Moto",
  TRUCK: "Caminhão",
  UTILITY_VEHICLE: "Veículo Utilitário",
  BIKE: "Bicicleta",
  ANIMAL: "Animal",
  ROAD_IMPLEMENT: "Implemento Rodoviário",
  FARM_IMPLEMENT: "Implemento Agrícola",
  JET: "Jato",
  JET_SKI: "Jet Ski",
  AIRCRAFT: "Aeronave",
  STUFF: "Carga",
  HUMAN: "Humano",
  OTHER: "Outro",
};

const timezones = [
  { label: "(UTC-12:00) Linha Internacional de Data Oeste", value: -12 },
  { label: "(UTC-11:00) Samoa", value: -11 },
  { label: "(UTC-10:00) Havaí", value: -10 },
  { label: "(UTC-09:00) Alasca", value: -9 },
  { label: "(UTC-08:00) Pacífico", value: -8 },
  { label: "(UTC-07:00) Montanha", value: -7 },
  { label: "(UTC-06:00) Central", value: -6 },
  { label: "(UTC-05:00) Leste", value: -5 },
  { label: "(UTC-04:00) Atlântico", value: -4 },
  { label: "(UTC-03:00) Brasília", value: -3 },
  { label: "(UTC-02:00) Meio-Atlântico", value: -2 },
  { label: "(UTC-01:00) Açores", value: -1 },
  { label: "(UTC+00:00) Padrão (UTC)", value: 0 },
  { label: "(UTC+01:00) Europa Ocnameental", value: 1 },
  { label: "(UTC+02:00) Europa Central", value: 2 },
  { label: "(UTC+03:00) Moscou", value: 3 },
  { label: "(UTC+04:00) Geórgia", value: 4 },
  { label: "(UTC+05:00) Paquistão", value: 5 },
  { label: "(UTC+06:00) Cazaquistão", value: 6 },
  { label: "(UTC+07:00) Indochina", value: 7 },
  { label: "(UTC+08:00) China", value: 8 },
  { label: "(UTC+09:00) Japão", value: 9 },
  { label: "(UTC+10:00) Austrália Oriental", value: 10 },
  { label: "(UTC+11:00) Ilhas Salomão", value: 11 },
  { label: "(UTC+12:00) Nova Zelândia", value: 12 },
  { label: "(UTC+13:00) Tonga", value: 13 },
  { label: "(UTC+14:00) Kiribati", value: 14 },
];

export const configurationProfileConstants = {
  config: {
    DM_E3_PLUS: configurationProfileE3Plus,
    DM_E3_PLUS_4G: configurationProfileE3Plus4G,
  },
  type,
  timezones,
};
