type Encoder = { command: "data_transmission_sleep"; args: number };

export class BwsLoraEncoder {
  static serial(serial: string): string {
    return `WINS=${serial}\r`;
  }

  static data_transmission_sleep(input: number): string {
    return `WCW=${input}\r`;
  }

  static lorawan_mode_duration(input: number): string {
    return `WWTO=${input}\r`;
  }

  static p2p_mode_duration(input: number): string {
    return `WLTO=${input}\r`;
  }

  // WLTR tem a mesma descrição do comando WWTR
  static data_transmission_position(input: number): string {
    return `WWTR=${input}\r`;
  }

  static lorawan_data_transmission_event(input: number): string {
    return `WEWTR=${input}\r`;
  }

  static p2p_data_transmission_event(input: number): string {
    return `WELTR=${input}\r`;
  }

  static data_transmission_status(input: number): string {
    return `WTS=${input}\r`;
  }

  static odometer(input: number): string {
    return `WODM=${input}\r`;
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

  static activation_type(input: string): string | undefined {
    if (input !== "00" && input !== "01") return undefined;
    return `WACT=${input}\r`;
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

  static led_lighting(input: string): string | undefined {
    if (input !== "00" && input !== "01") return undefined;
    return `WLED=${input}\r`;
  }

  static fifo_send_and_hold_times(times: number[]): string {
    return `WFIFO=${times.join(",")}\r`;
  }

  // sem descrição no documento
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
      serial: BwsLoraEncoder.serial,
      data_transmission_sleep: BwsLoraEncoder.data_transmission_sleep,
      lorawan_mode_duration: BwsLoraEncoder.lorawan_mode_duration,
      p2p_mode_duration: BwsLoraEncoder.p2p_mode_duration,
      data_transmission_position: BwsLoraEncoder.data_transmission_position,
      lorawan_data_transmission_event:
        BwsLoraEncoder.lorawan_data_transmission_event,
      p2p_data_transmission_event: BwsLoraEncoder.p2p_data_transmission_event,
      data_transmission_status: BwsLoraEncoder.data_transmission_status,
      odometer: BwsLoraEncoder.odometer,
      virtual_ignition_12v: BwsLoraEncoder.virtual_ignition_12v,
      virtual_ignition_24v: BwsLoraEncoder.virtual_ignition_24v,
      activation_type: BwsLoraEncoder.activation_type,
      heading: BwsLoraEncoder.heading,
      heading_detection_angle: BwsLoraEncoder.heading_detection_angle,
      heading_event_mode: BwsLoraEncoder.heading_event_mode,
      speed_alert_threshold: BwsLoraEncoder.speed_alert_threshold,
      accel_threshold_for_ignition_on:
        BwsLoraEncoder.accel_threshold_for_ignition_on,
      accel_threshold_for_ignition_off:
        BwsLoraEncoder.accel_threshold_for_ignition_off,
      accel_threshold_for_movement: BwsLoraEncoder.accel_threshold_for_movement,
      harsh_acceleration_threshold: BwsLoraEncoder.harsh_acceleration_threshold,
      harsh_braking_threshold: BwsLoraEncoder.harsh_braking_threshold,
      full_functionality_table: BwsLoraEncoder.full_functionality_table,
      full_configuration_table: BwsLoraEncoder.full_configuration_table,
      led_lighting: BwsLoraEncoder.led_lighting,
      fifo_send_and_hold_times: BwsLoraEncoder.fifo_send_and_hold_times,
      mcu_configuration: BwsLoraEncoder.mcu_configuration,
      output_table: BwsLoraEncoder.output_table,
      input_1: BwsLoraEncoder.input_1,
      input_2: BwsLoraEncoder.input_2,
      input_3: BwsLoraEncoder.input_3,
      input_4: BwsLoraEncoder.input_4,
      input_5: BwsLoraEncoder.input_5,
      input_6: BwsLoraEncoder.input_6,
      timestamp: BwsLoraEncoder.timestamp,
      device_eui: BwsLoraEncoder.device_eui,
      application_eui: BwsLoraEncoder.application_eui,
      application_key: BwsLoraEncoder.application_key,
      device_address: BwsLoraEncoder.device_address,
      network_session_key: BwsLoraEncoder.network_session_key,
      application_session_key: BwsLoraEncoder.application_session_key,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = BwsLoraEncoder.commands();
    return commands[command](args as any);
  }
}
