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
  static serial(input: string) {
    if (!input.includes("RINS=")) return undefined;
    const serial = input.split("RINS=")?.[1].replace(/\s+/g, "");
    return serial.length ? serial : undefined;
  }

  static imei(input: string) {
    if (!input.includes("RIMEI=")) return undefined;
    const imei = input.split("RIMEI=")?.[1].replace(/\s+/g, "");
    return imei.length ? imei : undefined;
  }

  static iccid(input: string) {
    if (!input.includes("ICCID=")) return undefined;
    const iccid = input.split("ICCID=")?.[1].replace(/\s+/g, "");
    return iccid.length ? iccid : undefined;
  }

  static auto_test(input: string): NB2.AutoTest | undefined {
    if (!input.startsWith("SN:")) return undefined;
    const splited = input.split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof NB2.AutoTest] = value;
      return acc;
    }, {} as NB2.AutoTest);
  }

  static odometer() {
    return "" as any;
  }
  static data_transmission_on() {
    return "" as any;
  }
  static data_transmission_off() {
    return "" as any;
  }
  static sleep() {
    return "" as any;
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
