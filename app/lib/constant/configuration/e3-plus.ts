import { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";

const functions = [
  {
    label: "Posição de LBS",
    name: "lbs_position",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Atualização da posição em curva",
    name: "cornering_position_update",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Alerta de ignição / Corte de alimentação (SMS)",
    name: "ignition_alert_power_cut",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Alerta de falha de GPRS (SMS)",
    name: "gprs_failure_alert",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Funcionamento dos LEDS",
    name: "led",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Ignição Virtual",
    name: "virtual_ignition",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
];

const optionalFunctions = [
  {
    label: "Modo de Operação",
    name: "operation_mode",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
];

const lockType = [
  { label: "Progressivo", value: 1 },
  { label: "Instantâneo", value: 2 },
  { label: "Inverso", value: 3 },
];

const accelerometerSensitivity = [
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
];

const economyMode = [
  { value: 0, label: "GPS Ligado (Em Sleep)" },
  { value: 1, label: "GPS Desligado (Em Sleep)" },
];

const workMode = [
  { value: "SLAVE", label: "Botão de Pânico" },
  { value: "MASTER", label: "Ignição Física" },
  { value: "NEGATIVE", label: "Violação de módulo" },
];

const configMappedGeneral: {
  [key in keyof IConfigurationProfile["config"]["general"]]: string;
} = {
  ip_primary: "Ip Primário",
  ip_secondary: "Ip Secundário",
  apn: "Apn",
  data_transmission_on: "Tempo de transmissão Ligado",
  data_transmission_off: "Tempo de transmissão Desligado",
  dns_primary: "Dns",
  keep_alive: "Tempo de TX",
};

const configMappedSpecific: {
  [key in keyof IConfigurationProfile["config"]["specific"]]: string;
} = {
  accelerometer_sensitivity: "Sensibilidade do Acelerômetro",
  cornering_position_update: "Atualização de posição em curva",
  economy_mode: "Modo de Economia",
  lbs_position: "Posição LBS",
  led: "Led",
  lock_type: "Tipo de Bloqueio",
  odometer: "Hodômetro",
  password: "Senha",
  timezone: "Fuso horário",
  virtual_ignition: "Ignição Virtual",
  sensitivity_adjustment: "Ajuste de sensibilidade",

  virtual_ignition_by_voltage: "Ignição virtual por tensão",
  virtual_ignition_by_movement: "Ignição virtual por movimento",
  communication_type: "Tipo de comunicação",
  protocol_type: "Tipo do protocolo",
  anti_theft: "Anti-Furto",
  horimeter: "Horímetro",
  jammer_detection: "Detecção de Jammer",
  clear_buffer: "Limpar Buffer",
  clear_horimeter: "Resetar Horímetro",
  input_1: "Entrada 1",
  input_2: "Entrada 2",
  angle_adjustment: "Ajuste de ângulo",
  lock_type_progression: "Definir progressão",
  ignition_by_voltage: "Ignição por voltagem",
  ack: "Definir ack",
  ignition_status_hb: "Status ignição hb",
};

export const configurationProfileE3Plus = {
  functions,
  optionalFunctions,
  lockType,
  accelerometerSensitivity,
  economyMode,
  workMode,
  configMapped: {
    general: configMappedGeneral,
    specific: configMappedSpecific,
  },
};
