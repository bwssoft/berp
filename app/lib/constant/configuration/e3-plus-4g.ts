import { IConfigurationProfile } from "../../@backend/domain";

const functions = [
  {
    label: "Detecção de jammer",
    name: "jammer_detection",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Anti-Furto",
    name: "anti_theft",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Posição de LBS",
    name: "lbs_position",
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
];

const optionalFunctions = [
  {
    label: "Limpar Buffer",
    name: "clear_buffer",
    data: [
      { label: "Ligado", value: true },
      { label: "Desligado", value: false },
    ],
  },
  {
    label: "Resetar Horímetro",
    name: "clear_horimeter",
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
  { value: 0, label: "Desligado" },
  { value: 1, label: "Meia Economia" },
  { value: 2, label: "Economia Máxima" },
];

const communicationType = [
  { value: "TCP", label: "TCP" },
  { value: "UDP", label: "UDP" },
];

const protocolType = [
  { value: "E3+", label: "E3" },
  { value: "GT06", label: "GT06" },
];

const jammerDetection = [
  { value: 0, label: "Desligado" },
  { value: 1, label: "Ligado" },
];

const input1 = [
  { value: 1, label: "Ignição" },
  { value: 2, label: "SOS" },
];

const input2 = [
  { value: 1, label: "Monitora" },
  { value: 2, label: "SOS" },
  { value: 3, label: "Módulo" },
];

const configMapped: { [key in keyof IConfigurationProfile["config"]]: string } =
  {
    accelerometer_sensitivity: "Sensibilidade do Acelerômetro",
    ip_primary: "Ip Primário",
    ip_secondary: "Ip Secundário",
    apn: "Apn",
    cornering_position_update: "Atualização de posição em curva",
    data_transmission_on: "Tempo de transmissão Ligado",
    data_transmission_off: "Tempo de transmissão Desligado",
    dns: "Dns",
    economy_mode: "Modo de Economia",
    keep_alive: "Tempo de TX",
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

export const configurationProfileE3Plus4G = {
  functions,
  optionalFunctions,
  lockType,
  accelerometerSensitivity,
  economyMode,
  communicationType,
  protocolType,
  jammerDetection,
  input1,
  input2,
  configMapped,
};
