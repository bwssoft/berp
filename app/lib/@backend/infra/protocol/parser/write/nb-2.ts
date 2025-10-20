import { BaseParser } from "../base";

export class BWSNB2WriteParser extends BaseParser {
  /**
   * Extrai o valor do serial de uma string que contém "RINS=" seguido de um número.
   *
   * @param input - A string que contém a informação do serial.
   * @returns O valor do serial ou undefined se o formato não for válido.
   */
  static serial(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WINS=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do imei de uma string que contém "RIMEI=" seguido de um número.
   *
   * @param input - A string que contém a informação do imei.
   * @returns O valor do imei ou undefined se o formato não for válido.
   */
  static imei(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIMEI=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição ligada de uma string que contém "RCN=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição ligada.
   * @returns O valor numérico do tempo de transmissão de ignição ligada ou undefined se o formato não for válido.
   */
  static data_transmission_on(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WCN=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição desligada de uma string que contém "RCW=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição desligada.
   * @returns O valor numérico do tempo de transmissão de ignição desligada ou undefined se o formato não for válido.
   */
  static data_transmission_off(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WCW=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do intervalo de transmissão em modo evento de uma string que contém "RCE=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão em evento.
   * @returns O valor numérico do tempo de transmissão em evento ou undefined se o formato não for válido.
   */
  static data_transmission_event(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WCE=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do tempo de keep alive de uma string que contém "RCK=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de keep alive.
   * @returns O valor numérico do tempo de keep alive ou undefined se o formato não for válido.
   */
  static keep_alive(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WCK=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do ip primário de uma string que contém "RIP1=0.0.0.0:7001"
   *
   * @param input - A string que contém a informação do ip primário.
   * @returns O valor numérico do ip primário ou undefined se o formato não for válido.
   */
  static ip_primary(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIP1=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }
  /**
   * Extrai o valor do ip secundário de uma string que contém "RIP2=3.208.166.39:7001"
   *
   * @param input - A string que contém a informação do ip secundário.
   * @returns O valor numérico do ip secundário ou undefined se o formato não for válido.
   */
  static ip_secondary(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIP2=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }
  /**
   * Extrai o valor do dns primário de uma string que contém "RID1=gw.dev.bws-infra.com:7001"
   *
   * @param input - A string que contém a informação do dns primário.
   * @returns O valor numérico do dns primário ou undefined se o formato não for válido.
   */
  static dns_primary(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WID1=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }
  /**
   * Extrai o valor do dns secundário de uma string que contém "RID2=gw.bws-infra.com:7001"
   *
   * @param input - A string que contém a informação do dns secundário.
   * @returns O valor numérico do dns secundário ou undefined se o formato não for válido.
   */
  static dns_secondary(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WID2=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }
  /**
   * Extrai o valor da apn de uma string que contém "RIAP=nbiot.arqia.br,arqia,arqia"
   *
   * @param input - A string que contém a informação da apn.
   * @returns O valor numérico da apn ou undefined se o formato não for válido.
   */
  static apn(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIAP=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do tempo para inciar o sleep de uma string que contém "RCS=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo para inicar o sleep.
   * @returns O valor numérico do tempo para inicar o sleep ou undefined se o formato não for válido.
   */
  static time_to_sleep(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WCS=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor do odômetro de uma string que contém "RODM=" seguido de um número.
   *
   * @param input - A string que contém a informação do odômetro.
   * @returns O valor numérico do odômetro ou undefined se o formato não for válido.
   */
  static odometer(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WODM=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da tensão 12V de uma string que contém "RIG12=110,150"
   *
   * @param input - A string que contém a informação da tensão 12V.
   * @returns O valor numérico da tensão 12V ou undefined se o formato não for válido.
   */
  static virtual_ignition_12v(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WRIG12=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da tensão 24V de uma string que contém "RIG24=276,281"
   *
   * @param input - A string que contém a informação da tensão 24V.
   * @returns O valor numérico da tensão 24V ou undefined se o formato não for válido.
   */
  static virtual_ignition_24v(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WRIG24=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }
  /**
   * Extrai o valor do ângulo de uma string que contém "RFA=30"
   *
   * @param input - A string que contém a informação do ângulo.
   * @returns O valor numérico do ângulo ou undefined se o formato não for válido.
   */
  static heading_detection_angle(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFA=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da velocidade de uma string que contém "RFV=100"
   *
   * @param input - A string que contém a informação da velocidade.
   * @returns O valor numérico da velocidade ou undefined se o formato não for válido.
   */
  static speed_alert_threshold(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFV=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando ligado de uma string que contém "RFTON=2"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando ligado.
   * @returns O valor numérico da sensibilidade do acelerometro quando ligado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_ignition_on(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFTON=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando desligado de uma string que contém "RFTOF=3"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando desligado.
   * @returns O valor numérico da sensibilidade do acelerometro quando desligado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_ignition_off(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFTOF=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando violado de uma string que contém "RFAV=150"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando violado.
   * @returns O valor numérico da sensibilidade do acelerometro quando violado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_movement(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFAV=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da aceleração máxima de uma string que contém "RFMA=50"
   *
   * @param input - A string que contém a informação da aceleração máxima.
   * @returns O valor numérico da aceleração máxima ou undefined se o formato não for válido.
   */
  static harsh_acceleration_threshold(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFMA=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  /**
   * Extrai o valor da desaceleração máxima de uma string que contém "RFMD=45"
   *
   * @param input - A string que contém a informação da desaceleração máxima.
   * @returns O valor numérico da desaceleração máxima ou undefined se o formato não for válido.
   */
  static harsh_braking_threshold(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFMD=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static input_1(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIN1=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static input_2(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIN2=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static input_3(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIN3=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static input_4(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WIN4=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static full_configuration_table(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WC=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static full_functionality_table(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WF=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static economy_mode(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("WFSM=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static lock_type(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("ROUT=")) return undefined;
    const value = input.replace(/\s+/g, "");
    return value;
  }

  static methods() {
    return {
      w_serial: this.serial,
      w_imei: this.imei,
      w_data_transmission_on: this.data_transmission_on,
      w_data_transmission_off: this.data_transmission_off,
      w_data_transmission_event: this.data_transmission_event,
      w_keep_alive: this.keep_alive,
      w_ip_primary: this.ip_primary,
      w_ip_secondary: this.ip_secondary,
      w_dns_primary: this.dns_primary,
      w_dns_secondary: this.dns_secondary,
      w_apn: this.apn,
      w_time_to_sleep: this.time_to_sleep,
      w_odometer: this.odometer,
      w_virtual_ignition_12v: this.virtual_ignition_12v,
      w_virtual_ignition_24v: this.virtual_ignition_24v,
      w_heading_detection_angle: this.heading_detection_angle,
      w_speed_alert_threshold: this.speed_alert_threshold,
      w_accel_threshold_for_ignition_on: this.accel_threshold_for_ignition_on,
      w_accel_threshold_for_ignition_off: this.accel_threshold_for_ignition_off,
      w_accel_threshold_for_movement: this.accel_threshold_for_movement,
      w_harsh_acceleration_threshold: this.harsh_acceleration_threshold,
      w_harsh_braking_threshold: this.harsh_braking_threshold,
      w_input_1: this.input_1,
      w_input_2: this.input_2,
      w_input_3: this.input_3,
      w_input_4: this.input_4,
      w_full_configuration_table: this.full_configuration_table,
      w_full_functionality_table: this.full_functionality_table,
      w_economy_mode: this.economy_mode,
      w_lock_type: this.lock_type,
    };
  }
}
