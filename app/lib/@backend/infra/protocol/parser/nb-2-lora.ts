export namespace BwsNb2Lora {
  export interface AutoTest {
    DEV: string; //DM_BWS_NB2_LORA
    SN: string; //FFFFFFFF
    IC: string; //89554000000353233539
    IM: string; //860197071276904
    FW: string; //BWSIot_NB+LoRa_V_1.0.0_24/04/25
    GPS: string; //OK
    GPSf: string; //OK
    MDM: string; //OK
    RSSI: string; //OK
    IN1: string; //OK
    IN2: string; //OK
    OUT: string; //OK
    ACELC: string; //STK8321
    ACELP: string; //OK
    ID_ACEL: string; //35
    ID_MEM: string; //20154016
    VCC: string; //121
    BATT_VOLT: string; //41
    CHARGER: string; //OK
    TEMP: string; //14
    RF: string; //OK
  }
}

export class BwsNb2LoraParser {
  /**
   * LORA
   *
   * */
  /**
   * Extrai o valor do serial de uma string que contém "RINS=" seguido de um número.
   *
   * @param input - A string que contém a informação do serial.
   * @returns O valor do serial ou undefined se o formato não for válido.
   */
  static serial(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RINS=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'timestamp' de uma string que contém "RTK=" seguido de um número.
   *
   * @param input - A string que contém a informação do 'timestamp'.
   * @returns O valor do 'timestamp' ou undefined se o formato não for válido.
   */
  static timestamp(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RTK=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'device address' de uma string que contém "RDA=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'device address'.
   * @returns O valor do 'device address' ou undefined se o formato não for válido.
   */
  static device_address(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RDA=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'device eui' de uma string que contém "RDE=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'device eui'.
   * @returns O valor do 'device eui' ou undefined se o formato não for válido.
   */
  static device_eui(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RDE=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'application eui' de uma string que contém "RAP=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'application eui'.
   * @returns O valor do 'application eui' ou undefined se o formato não for válido.
   */
  static application_eui(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RAP=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'application key' de uma string que contém "RAK=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'application key'.
   * @returns O valor do 'application key' ou undefined se o formato não for válido.
   */
  static application_key(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RAK=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'application session key' de uma string que contém "RASK=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'application session key'.
   * @returns O valor do 'application session key' ou undefined se o formato não for válido.
   */
  static application_session_key(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RASK=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do 'network session key' de uma string que contém "RASK=" seguido de uma chave.
   *
   * @param input - A string que contém a informação do 'network session key'.
   * @returns O valor do 'network session key' ou undefined se o formato não for válido.
   */
  static network_session_key(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RNK=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição desligada de uma string que contém "RCW=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição desligada.
   * @returns O valor numérico do tempo de transmissão de ignição desligada ou undefined se o formato não for válido.
   */
  static data_transmission_sleep(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RCW=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = parseFloat(data);

    return isNaN(value) ? undefined : value;
  }

  static heading(input: string): boolean | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFH=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    if (value !== "00" && value !== "01") return undefined;

    return value === "01";
  }

  static heading_event_mode(input: string): boolean | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFHV=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    if (value !== "00" && value !== "01") return undefined;

    return value === "01";
  }

  static data_transmission_position(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RWTR=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  static led_lighting(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RLED=");

    if (parts.length < 2) return undefined;

    const led = parts[1].trim();

    const value = led.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static p2p_mode_duration(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RLTO=");

    if (parts.length < 2) return undefined;

    const mode = parts[1].trim();

    const value = parseFloat(mode);

    return isNaN(value) ? undefined : value;
  }

  static lorawan_mode_duration(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RWTO=");

    if (parts.length < 2) return undefined;

    const mode = parts[1].trim();

    const value = parseFloat(mode);

    return isNaN(value) ? undefined : value;
  }

  static input_5(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN5=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static input_6(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN6=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static fifo_send_and_hold_times(input: string): number[] | undefined {
    if (typeof input !== "string") return undefined;

    // Regex: captura dois números (inteiros ou decimais) após "RFIFO="
    const match = input.match(/^RFIFO=(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)$/);
    if (!match) return undefined;

    const [, sendStr, holdStr] = match;
    const send = parseFloat(sendStr);
    const hold = parseFloat(holdStr);

    // Caso queira garantir números válidos, embora a regex já filtre
    if (Number.isNaN(send) || Number.isNaN(hold)) return undefined;

    return [send, hold];
  }

  static lorawan_data_transmission_event(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("REWTR=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = parseFloat(data);

    return isNaN(value) ? undefined : value;
  }

  static p2p_data_transmission_event(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RELTR=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = parseFloat(data);

    return isNaN(value) ? undefined : value;
  }

  static data_transmission_status(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RTS=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = parseFloat(data);

    return isNaN(value) ? undefined : value;
  }

  static activation_type(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RACT=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    if (value !== "00" && value !== "01") return undefined;

    return value;
  }

  static mcu_configuration(input: string): string | undefined {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RMC=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static output_table(input: string): number[] | undefined {
    if (typeof input !== "string") return undefined;

    // Regex: captura três números (inteiros ou decimais) após "ROUT="
    const match = input.match(
      /^ROUT=(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)$/
    );
    if (!match) return undefined;

    const [, firstStr, secondStr, thirdStr] = match;
    const first = parseFloat(firstStr);
    const second = parseFloat(secondStr);
    const third = parseFloat(thirdStr);

    // Caso queira garantir números válidos, embora a regex já filtre
    if (Number.isNaN(first) || Number.isNaN(second) || Number.isNaN(third))
      return undefined;

    return [first, second, third];
  }

  /**
   * NB2
   */

  /**
   * Extrai o valor do imei de uma string que contém "RIMEI=" seguido de um número.
   *
   * @param input - A string que contém a informação do imei.
   * @returns O valor do imei ou undefined se o formato não for válido.
   */
  static imei(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RIMEI=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do iccid de uma string que contém "ICCID=" seguido de um número.
   *
   * @param input - A string que contém a informação do iccid.
   * @returns O valor do iccid ou undefined se o formato não for válido.
   */
  static iccid(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("ICCID=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do firmware de uma string que contém "RFW=" seguido de um número.
   *
   * @param input - A string que contém a informação do firmware.
   * @returns O valor do firmware ou undefined se o formato não for válido.
   */
  static firmware(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RFW=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai um objeto da resposta do comando auto test.
   *
   * @param input - A string que contém a informação do autotest.
   * @returns O objeto do resultado do auto test ou undefined se o formato não for válido.
   */
  static auto_test(input: string): BwsNb2Lora.AutoTest | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("AUTOTEST=");
    if (parts.length < 2) return undefined;
    const splited = parts[1].split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof BwsNb2Lora.AutoTest] = value;
      return acc;
    }, {} as BwsNb2Lora.AutoTest);
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição ligada de uma string que contém "RCN=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição ligada.
   * @returns O valor numérico do tempo de transmissão de ignição ligada ou undefined se o formato não for válido.
   */
  static data_transmission_on(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RCN=");
    if (parts.length < 2) return undefined;

    const dataTransmissionOn = parts[1].trim();

    const value = parseFloat(dataTransmissionOn);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição desligada de uma string que contém "RCW=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição desligada.
   * @returns O valor numérico do tempo de transmissão de ignição desligada ou undefined se o formato não for válido.
   */
  static data_transmission_off(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RCW=");
    if (parts.length < 2) return undefined;

    const dataTransmissionOff = parts[1].trim();

    const value = parseFloat(dataTransmissionOff);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do intervalo de transmissão em modo evento de uma string que contém "RCE=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão em evento.
   * @returns O valor numérico do tempo de transmissão em evento ou undefined se o formato não for válido.
   */
  static data_transmission_event(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RCE=");

    if (parts.length < 2) return undefined;

    const dataTransmissionEvent = parts[1].trim();

    const value = parseFloat(dataTransmissionEvent);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do tempo de keep alive de uma string que contém "RCK=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de keep alive.
   * @returns O valor numérico do tempo de keep alive ou undefined se o formato não for válido.
   */
  static keep_alive(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RCK=");

    if (parts.length < 2) return undefined;

    const keep_alive = parts[1].trim();

    const value = parseFloat(keep_alive);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do ip primário de uma string que contém "RIP1=0.0.0.0:7001"
   *
   * @param input - A string que contém a informação do ip primário.
   * @returns O valor numérico do ip primário ou undefined se o formato não for válido.
   */
  static ip_primary(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIP1=");
    if (parts.length < 2) return undefined;
    const [ip, port] = parts[1].split(":");
    if (!ip || !port) return undefined;
    return {
      ip,
      port: Number(port),
    };
  }
  /**
   * Extrai o valor do ip secundário de uma string que contém "RIP2=3.208.166.39:7001"
   *
   * @param input - A string que contém a informação do ip secundário.
   * @returns O valor numérico do ip secundário ou undefined se o formato não for válido.
   */
  static ip_secondary(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIP2=");
    if (parts.length < 2) return undefined;
    const [ip, port] = parts[1].split(":");
    if (!ip || !port) return undefined;
    return {
      ip,
      port: Number(port),
    };
  }
  /**
   * Extrai o valor do dns primário de uma string que contém "RID1=gw.dev.bws-infra.com:7001"
   *
   * @param input - A string que contém a informação do dns primário.
   * @returns O valor numérico do dns primário ou undefined se o formato não for válido.
   */
  static dns_primary(input: string) {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RID1=");
    if (parts.length < 2) return undefined;
    const [address, port] = parts[1].split(":");
    if (!address || !port) return undefined;
    return {
      address,
      port: Number(port),
    };
  }
  /**
   * Extrai o valor do dns secundário de uma string que contém "RID2=gw.bws-infra.com:7001"
   *
   * @param input - A string que contém a informação do dns secundário.
   * @returns O valor numérico do dns secundário ou undefined se o formato não for válido.
   */
  static dns_secondary(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RID2=");
    if (parts.length < 2) return undefined;
    const [address, port] = parts[1].split(":");
    if (!address || !port) return undefined;
    return {
      address,
      port: Number(port),
    };
  }
  /**
   * Extrai o valor da apn de uma string que contém "RIAP=nbiot.arqia.br,arqia,arqia"
   *
   * @param input - A string que contém a informação da apn.
   * @returns O valor numérico da apn ou undefined se o formato não for válido.
   */
  static apn(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIAP=");
    if (parts.length < 2) return undefined;
    const [address, user, password] = parts[1].split(",");
    if (!address || !user) return undefined;
    return {
      address,
      user,
      password,
    };
  }

  /**
   * Extrai o valor do tempo para inciar o sleep de uma string que contém "RCS=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo para inicar o sleep.
   * @returns O valor numérico do tempo para inicar o sleep ou undefined se o formato não for válido.
   */
  static time_to_sleep(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RCS=");

    if (parts.length < 2) return undefined;

    const dataTransmissionEvent = parts[1].trim();

    const value = parseFloat(dataTransmissionEvent);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do odômetro de uma string que contém "RODM=" seguido de um número.
   *
   * @param input - A string que contém a informação do odômetro.
   * @returns O valor numérico do odômetro ou undefined se o formato não for válido.
   */
  static odometer(input: string): number | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RODM=");
    if (parts.length < 2) return undefined;

    const odometerValue = parts[1].trim();

    const value = parseFloat(odometerValue);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da tensão 12V de uma string que contém "RIG12=110,150"
   *
   * @param input - A string que contém a informação da tensão 12V.
   * @returns O valor numérico da tensão 12V ou undefined se o formato não for válido.
   */
  static virtual_ignition_12v(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIG12=");
    if (parts.length < 2) return undefined;
    const [initial, final] = parts[1].split(",");
    if (!initial || !final) return undefined;
    return {
      initial: parseFloat(initial),
      final: parseFloat(final),
    };
  }

  /**
   * Extrai o valor da tensão 24V de uma string que contém "RIG24=276,281"
   *
   * @param input - A string que contém a informação da tensão 24V.
   * @returns O valor numérico da tensão 24V ou undefined se o formato não for válido.
   */
  static virtual_ignition_24v(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIG24=");
    if (parts.length < 2) return undefined;
    const [initial, final] = parts[1].split(",");
    if (!initial || !final) return undefined;
    return {
      initial: parseFloat(initial),
      final: parseFloat(final),
    };
  }
  /**
   * Extrai o valor do ângulo de uma string que contém "RFA=30"
   *
   * @param input - A string que contém a informação do ângulo.
   * @returns O valor numérico do ângulo ou undefined se o formato não for válido.
   */
  static heading_detection_angle(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFA=");

    if (parts.length < 2) return undefined;

    const angle = parts[1].trim();

    const value = parseFloat(angle);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da velocidade de uma string que contém "RFV=100"
   *
   * @param input - A string que contém a informação da velocidade.
   * @returns O valor numérico da velocidade ou undefined se o formato não for válido.
   */
  static speed_alert_threshold(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFV=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando ligado de uma string que contém "RFTON=2"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando ligado.
   * @returns O valor numérico da sensibilidade do acelerometro quando ligado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_ignition_on(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFTON=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando desligado de uma string que contém "RFTOF=3"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando desligado.
   * @returns O valor numérico da sensibilidade do acelerometro quando desligado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_ignition_off(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFTOF=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da sensibilidade do acelerometro quando violado de uma string que contém "RFAV=150"
   *
   * @param input - A string que contém a informação da sensibilidade do acelerometro quando violado.
   * @returns O valor numérico da sensibilidade do acelerometro quando violado ou undefined se o formato não for válido.
   */
  static accel_threshold_for_movement(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFAV=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da aceleração máxima de uma string que contém "RFMA=50"
   *
   * @param input - A string que contém a informação da aceleração máxima.
   * @returns O valor numérico da aceleração máxima ou undefined se o formato não for válido.
   */
  static harsh_acceleration_threshold(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFMA=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor da desaceleração máxima de uma string que contém "RFMD=45"
   *
   * @param input - A string que contém a informação da desaceleração máxima.
   * @returns O valor numérico da desaceleração máxima ou undefined se o formato não for válido.
   */
  static harsh_braking_threshold(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFMD=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  static input_1(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN1=");

    if (parts.length < 2) return undefined;

    const input_1 = parts[1].trim();

    const value = parseFloat(input_1);

    return isNaN(value) ? undefined : value;
  }

  static input_2(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN2=");

    if (parts.length < 2) return undefined;

    const input_2 = parts[1].trim();

    const value = parseFloat(input_2);

    return isNaN(value) ? undefined : value;
  }

  static input_3(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN3=");

    if (parts.length < 2) return undefined;

    const input_3 = parts[1].trim();

    const value = parseFloat(input_3);

    return isNaN(value) ? undefined : value;
  }

  static input_4(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RIN4=");

    if (parts.length < 2) return undefined;

    const input_4 = parts[1].trim();

    const value = parseFloat(input_4);

    return isNaN(value) ? undefined : value;
  }

  static full_configuration_table(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RC=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static full_functionality_table(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RF=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  static economy_mode(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("RFSM=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    const value = data.replace(/\s+/g, "");

    if (value !== "1" && value !== "2") return undefined;

    return value;
  }
}
