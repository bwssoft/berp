export namespace BWS4G {
  export interface AutoTest {
    ACELC: string; //"STK8321"
    ACELP: string; //"OK"
    BATT_VOLT: string; //"0"
    CHARGER: string; //"OK"
    FW: string; //
    GPS: string; //"OK"
    GPSf: string; //"NOK"
    IC: string; //"89554000000351060991"
    ID_ACEL: string; //"35"
    ID_MEM: string; //"20154016"
    IM: string; //"123456789923964"
    IN1: string; //"NOK"
    IN2: string; //"OK"
    MDM: string; //"OK"
    OUT: string; //"NOK"
    RSI: string; //"OK"
    SN: string; //"16868634"
    VCC: string; //"48"
    TEMP: string; //"25"
    DEV: string; // "DM_BWS_4G"
  }
}

export class BWS4GParser {
  /**
   * Extrai o valor do serial de uma string que contém "RINS=" seguido de um número.
   *
   * @param input - A string que contém a informação do serial.
   * @returns O valor do serial ou undefined se o formato não for válido.
   */
  static serial(input: string): string | undefined {
    const parts = input.split("RINS=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value : undefined;
  }

  /**
   * Extrai o valor do imei de uma string que contém "RIMEI=" seguido de um número.
   *
   * @param input - A string que contém a informação do imei.
   * @returns O valor do imei ou undefined se o formato não for válido.
   */
  static imei(input: string): string | undefined {
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
  static auto_test(input: string): BWS4G.AutoTest | undefined {
    const parts = input.split("AUTOTEST=");
    if (parts.length < 2) return undefined;
    const splited = parts[1].split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof BWS4G.AutoTest] = value;
      return acc;
    }, {} as BWS4G.AutoTest);
  }

  /**
   * Extrai o valor do odômetro de uma string que contém "RODM=" seguido de um número.
   *
   * @param input - A string que contém a informação do odômetro.
   * @returns O valor numérico do odômetro ou undefined se o formato não for válido.
   */
  static odometer(input: string): number | undefined {
    const parts = input.split("RODM=");
    if (parts.length < 2) return undefined;

    const odometerValue = parts[1].trim();

    const value = parseFloat(odometerValue);

    return isNaN(value) ? undefined : value / 10;
  }

  /**
   * Extrai o valor do tempo de transmissão de ignição ligada de uma string que contém "RCN=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição ligada.
   * @returns O valor numérico do tempo de transmissão de ignição ligada ou undefined se o formato não for válido.
   */
  static data_transmission_on(input: string): number | undefined {
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
    const parts = input.split("RCW=");
    if (parts.length < 2) return undefined;

    const dataTransmissionOff = parts[1].trim();

    const value = parseFloat(dataTransmissionOff);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do tempo de sleep de uma string que contém "RCE=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão em evento.
   * @returns O valor numérico do tempo de transmissão em evento ou undefined se o formato não for válido.
   */
  static data_transmission_event(input: string): number | undefined {
    const parts = input.split("RCE=");

    if (parts.length < 2) return undefined;

    const dataTransmissionEvent = parts[1].trim();

    const value = parseFloat(dataTransmissionEvent);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do tempo de sleep de uma string que contém "RCS=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de sleep.
   * @returns O valor numérico do tempo de sleep ou undefined se o formato não for válido.
   */
  static sleep(input: string): number | undefined {
    const parts = input.split("RCS=");

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
   * Extrai o valor da tensão 12V de uma string que contém "RIG12=110,150"
   *
   * @param input - A string que contém a informação da tensão 12V.
   * @returns O valor numérico da tensão 12V ou undefined se o formato não for válido.
   */
  static first_voltage(input: string) {
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
  static second_voltage(input: string) {
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
  static angle(input: string) {
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
  static speed(input: string) {
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
  static accelerometer_sensitivity_on(input: string) {
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
  static accelerometer_sensitivity_off(input: string) {
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
  static accelerometer_sensitivity_violated(input: string) {
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
  static maximum_acceleration(input: string) {
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
  static maximum_deceleration(input: string) {
    const parts = input.split("RFMD=");

    if (parts.length < 2) return undefined;

    const speed = parts[1].trim();

    const value = parseFloat(speed);

    return isNaN(value) ? undefined : value;
  }

  static input_1() {
    return "" as any;
  }
  static input_2() {
    return "" as any;
  }
  static input_3() {
    return "" as any;
  }
  static input_4() {
    return "" as any;
  }
}
