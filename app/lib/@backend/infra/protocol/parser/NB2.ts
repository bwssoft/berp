export namespace NB2 {
  export interface AutoTest {
    ACELC: string; //"STK8321"
    ACELP: string; //"OK"
    BATT_VOLT: string; //"0"
    CHARGER: string; //"OK"
    FW: string; //"BWSIot_NB2_V_0.0_(10/03/25)"
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
  }
}

export class NB2Parser {
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
   * Extrai um objeto da resposta do comando auto test.
   *
   * @param input - A string que contém a informação do autotest.
   * @returns O objeto do resultado do auto test ou undefined se o formato não for válido.
   */
  static auto_test(input: string): NB2.AutoTest | undefined {
    if (!input.startsWith("SN:")) return undefined;
    const splited = input.split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof NB2.AutoTest] = value;
      return acc;
    }, {} as NB2.AutoTest);
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
   * Extrai o valor do tempo de transmissão de ignição ligada de uma string que contém "RCE=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão de ignição ligada.
   * @returns O valor numérico do do tempo de transmissão de ignição ligada ou undefined se o formato não for válido.
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
   * @returns O valor numérico do do tempo de transmissão de ignição desligada ou undefined se o formato não for válido.
   */
  static data_transmission_off(input: string): number | undefined {
    const parts = input.split("RCW=");
    if (parts.length < 2) return undefined;

    const dataTransmissionOff = parts[1].trim();

    const value = parseFloat(dataTransmissionOff);

    return isNaN(value) ? undefined : value;
  }

  /**
   * Extrai o valor do tempo de sleep de uma string que contém "RCN=" seguido de um número.
   *
   * @param input - A string que contém a informação do tempo de transmissão em evento.
   * @returns O valor numérico do do tempo de transmissão em evento ou undefined se o formato não for válido.
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
   * @returns O valor numérico do do tempo de sleep ou undefined se o formato não for válido.
   */
  static sleep(input: string): number | undefined {
    const parts = input.split("RCS=");

    if (parts.length < 2) return undefined;

    const dataTransmissionEvent = parts[1].trim();

    const value = parseFloat(dataTransmissionEvent);

    return isNaN(value) ? undefined : value;
  }

  static keep_alive() {
    return "" as any;
  }
  static ip_primary() {
    return "" as any;
  }
  static ip_secondary() {
    return "" as any;
  }
  static dns_primary() {
    return "" as any;
  }
  static dns_secondary() {
    return "" as any;
  }
  static apn() {
    return "" as any;
  }
  static first_voltage() {
    return "" as any;
  }
  static second_voltage() {
    return "" as any;
  }
  static angle() {
    return "" as any;
  }
  static speed() {
    return "" as any;
  }
  static accelerometer_sensitivity_on() {
    return "" as any;
  }
  static accelerometer_sensitivity_off() {
    return "" as any;
  }
  static accelerometer_sensitivity_violated() {
    return "" as any;
  }
  static maximum_acceleration() {
    return "" as any;
  }
  static maximum_deceleration() {
    return "" as any;
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
