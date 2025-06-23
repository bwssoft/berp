type Encoder = { command: "sleep"; args: number };

// data_transmission_on;
// sleep;
// data_transmission_off - existe?;
// apn - existe?;
// keep_alive - existe?; WTS=
// ip_primary - não existe;
// ip_secondary - não existe;
// dns_primary - não existe;
// dns_secondary - não existe;
export class LORAEncoder {
  static serial(serial: string): string {
    return `WINS=${serial}\r`;
  }

  // WLTR tem a mesma descrição do comando WWTR
  static data_transmission_on(input: number): string {
    return `WWTR=${input}\r`;
  }

  static sleep(input: number): string {
    return `WCW=${input}\r`;
  }

  static odometer(input: number): string {
    return `WODM=${input}\r`;
  }

  static activation_type(input: "ABP" | "OTAA"): string | undefined {
    if (input !== "ABP" && input !== "OTAA") return undefined;
    return `WACT=${input}\r`;
  }

  static lorawan_mode_duration(input: number): string {
    return `WWTO=${input}\r`;
  }

  static lorawan_data_transmission_event(input: number): string {
    return `WEWTR=${input}\r`;
  }

  static p2p_mode_duration(input: number): string {
    return `WLTO=${input}\r`;
  }

  static p2p_data_transmission_event(input: number): string {
    return `WELTR=${input}\r`;
  }

  static virtual_ignition_12v(input: {
    initial: number;
    final: number;
  }): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return undefined;
    return `WIG1=${input.initial},${input.final}\r`;
  }

  static virtual_ignition_24v(input: {
    initial: number;
    final: number;
  }): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return undefined;
    return `WIG2=${input.initial},${input.final}\r`;
  }

  static heading(input: boolean): string | undefined {
    if (typeof input !== "boolean") return undefined;
    return input ? "WFHON\r" : "WFHOFF\r";
  }

  static heading_detection_angle(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFA=${input}\r`;
  }

  static heading_event_mode(input: boolean): string | undefined {
    if (typeof input !== "boolean") return undefined;
    return input ? "WFHEON\r" : "WFHEOFF\r";
  }

  static speed_alert_threshold(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFV=${input}\r`;
  }

  static accel_threshold_for_ignition_on(input: number): string {
    return `WFTON=${input}\r`;
  }

  static accel_threshold_for_ignition_off(input: number): string {
    return `WFTOF=${input}\r`;
  }

  static accel_threshold_for_movement(input: number): string {
    return `WFAV=${input}\r`;
  }

  static harsh_acceleration_threshold(input: number): string {
    return `WFMA=${input}\r`;
  }

  static harsh_braking_threshold(input: number): string {
    return `WFMD=${input}\r`;
  }

  /**
   * |-- COMANDOS FORA DO FORM DE CONFIGURAÇÃO --|
   */

  static full_functionality_table(): string {
    return "WF=";
  }

  static full_configuration_table(): string {
    return "WC=";
  }

  static status(input: number): string {
    return `WTS=${input}\r`;
  }

  static led_configuration(input: number): string {
    return `WLED=${input}\r`;
  }

  static fifo_send_and_hold_times(times: number[]): string {
    return `WFIFO=${times.join(",")}\r`;
  }

  static mcu_configuration(): string {
    return "WMC=";
  }

  static output_table(input: number[]): string {
    return `WOUT=${input.join(",")}\r`;
  }

  static input_1(input: number): string {
    return `WIN1=${input}\r`;
  }

  static input_2(input: number): string {
    return `WIN2=${input}\r`;
  }

  static input_3(input: number): string {
    return `WIN3=${input}\r`;
  }

  static input_4(input: number): string {
    return `WIN4=${input}\r`;
  }

  static input_5(input: number): string {
    return `WIN5=${input}\r`;
  }

  static input_6(input: number): string {
    return `WIN6=${input}\r`;
  }

  static timestamp(input: number): string {
    return `WTK=${input}\r`;
  }

  static device_eui(input: string): string {
    return `WDE=${input}\r`;
  }

  static application_eui(input: string): string {
    return `WAP=${input}\r`;
  }

  static application_key(input: string): string {
    return `WAK=${input}\r`;
  }

  static device_address(input: string): string {
    return `WDA=${input}\r`;
  }

  static network_session_key(input: string): string {
    return `WNK=${input}\r`;
  }

  static application_session_key(input: string): string {
    return `WASK=${input}\r`;
  }

  static commands() {
    return {
      serial: LORAEncoder.serial,
      sleep: LORAEncoder.sleep,
      data_transmission_on: LORAEncoder.data_transmission_on,
      status: LORAEncoder.status,
      full_configuration_table: LORAEncoder.full_configuration_table,
      lorawan_mode_duration: LORAEncoder.lorawan_mode_duration,
      p2p_mode_duration: LORAEncoder.p2p_mode_duration,
      led_configuration: LORAEncoder.led_configuration,
      fifo_send_and_hold_times: LORAEncoder.fifo_send_and_hold_times,
      lorawan_data_transmission_event:
        LORAEncoder.lorawan_data_transmission_event,
      p2p_data_transmission_event: LORAEncoder.p2p_data_transmission_event,
      odometer: LORAEncoder.odometer,
      virtual_ignition_12v: LORAEncoder.virtual_ignition_12v,
      virtual_ignition_24v: LORAEncoder.virtual_ignition_24v,
      full_functionality_table: LORAEncoder.full_functionality_table,
      heading_detection_angle: LORAEncoder.heading_detection_angle,
      speed_alert_threshold: LORAEncoder.speed_alert_threshold,
      accel_threshold_for_ignition_on:
        LORAEncoder.accel_threshold_for_ignition_on,
      accel_threshold_for_ignition_off:
        LORAEncoder.accel_threshold_for_ignition_off,
      accel_threshold_for_movement: LORAEncoder.accel_threshold_for_movement,
      harsh_acceleration_threshold: LORAEncoder.harsh_acceleration_threshold,
      harsh_braking_threshold: LORAEncoder.harsh_braking_threshold,
      heading: LORAEncoder.heading,
      heading_event_mode: LORAEncoder.heading_event_mode,
      mcu_configuration: LORAEncoder.mcu_configuration,
      input_1: LORAEncoder.input_1,
      input_2: LORAEncoder.input_2,
      input_3: LORAEncoder.input_3,
      input_4: LORAEncoder.input_4,
      input_5: LORAEncoder.input_5,
      input_6: LORAEncoder.input_6,
      output_table: LORAEncoder.output_table,
      activation_type: LORAEncoder.activation_type,
      timestamp: LORAEncoder.timestamp,
      device_eui: LORAEncoder.device_eui,
      application_eui: LORAEncoder.application_eui,
      application_key: LORAEncoder.application_key,
      device_address: LORAEncoder.device_address,
      network_session_key: LORAEncoder.network_session_key,
      application_session_key: LORAEncoder.application_session_key,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = LORAEncoder.commands();
    return commands[command](args as any);
  }
}
