export namespace BwsNb2 {
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
    TEMP: string; //"25"
    DEV: string; // "DM_BWS_NB2"
  }
}

const CHECK_KEYS_MAPPER = {
  ROUT: "OUT", // Saida
  RFSM: "SDMS", // Modo de economia
  RODM: "DK", // Odometro
  RFA: "TDET", // Angulo de curva
  RCN: "RCN", // Chave ligada - tempo de comunicacao
  RCW: "RCW", // Chave desligada - tempo de comunicacao
  RC: "RC", // Tempo de posicao
};

const CHECK_MAPPER = {
  apn: {
    from: "RIAP",
    to: "APN",
  },
  ip_primary: {
    from: "RIP1",
    to: "IP1",
  },
  ip_secondary: {
    from: "RIP2",
    to: "IP2",
  },
  dns_primary: {
    from: "RID1",
    to: "DNS1",
  },
  dns_secondary: {
    from: "RID2",
    to: "DNS2",
  },
  keep_alive: {
    from: "RCK",
    to: "KEEP_ALIVE",
  },
  odometer: {
    from: "RODM",
    to: "ODOMETER",
  },
  economy_mode: {
    from: "RFSM",
    to: "ECONOMY_MODE",
  },
  data_transmission_on: {
    from: "RCN",
    to: "IGNITION_ON",
  },
  data_transmission_off: {
    from: "RCW",
    to: "IGNITION_OFF",
  },
  virtual_ignition_12v: {
    from: "RIG12",
    to: "IV12",
  },
  virtual_ignition_24v: {
    from: "RIG24",
    to: "IV24",
  },
  lock_type: {
    from: "ROUT",
    to: "OUT",
  },
  data_transmission_event: {
    from: "RCE",
    to: "RCE"
  },
  heading_detection_angle: {
    from: "RFA",
    to: "ANGLE"
  },
  speed_alert_threshold: {
    from: "RFV",
    to: "RFV"
  },
  accel_threshold_for_ignition_on: {
    from: "RFTON",
    to: "RFTON"
  },
  accel_threshold_for_ignition_off: {
    from: "RFTOF",
    to: "RFTOF"
  },
  accel_threshold_for_movement: {
    from: "RFAV",
    to: "RFAV",
  },
  harsh_acceleration_threshold: {
    from: "RFMA",
    to: "RFMA",
  },
  harsh_braking_threshold: {
    from: "RFMD",
    to: "RFMD"
  },
  full_configuration_table: {
    from: "RC",
    to: "POSITION_TIME" 
  },
  full_functionality_table: {
    from: "RF",
    to: "RF",
  },
};

export class BwsNb2Parser {
  static check(input: Record<string, any>) {
    if (Object.keys(input).length > 0) {
      const translatedCheck = Object.keys(input).reduce((check, key) => {
        const checkMapperValue = CHECK_MAPPER[key as keyof typeof CHECK_MAPPER];
        if (checkMapperValue) {
          console.log(`${checkMapperValue.from} para ${checkMapperValue.to}`)

          const value = input[key].replace(
            checkMapperValue.from,
            checkMapperValue.to
          );
          return check + `${value} `;
        } else {
          console.log(`${input[key]} para --`)
        }

        const value = input[key];
        return check + `${value} `;
      }, "");

      const nativeCheck = Object.keys(input).reduce((check, key) => {
        const value = input[key];

        return check + `${value} `;
      }, "");

      return {
        normalized_check: translatedCheck,
        raw_check: nativeCheck,
      };
    }

    return undefined;
  }

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

    return value.length ? value.padStart(8, "0") : undefined;
  }

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
  static auto_test(input: string): BwsNb2.AutoTest | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("AUTOTEST=");
    if (parts.length < 2) return undefined;
    const splited = parts[1].split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof BwsNb2.AutoTest] = value;
      return acc;
    }, {} as BwsNb2.AutoTest);
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

    return Number(value);
  }

  static lock_type(input: string) {
    if (typeof input !== "string") return undefined;

    const parts = input.split("ROUT=");

    if (parts.length < 2) return undefined;

    const data = parts[1].trim();

    if (data !== "0 0 8" && data !== "0 0 0") return undefined;

    if (data === "0 0 0") return 1;

    if (data === "0 0 8") return 2;
  }
}
