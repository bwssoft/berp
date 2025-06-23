import { createOneConfigurationProfile } from "@/app/lib/@backend/action";
import { EType, ITechnology } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../util";

const password = z
  .object({
    old: z.string().optional(),
    new: z.string().optional(),
  })
  .optional();

const sleep = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(1, { message: "O valor deve ser no mínimmo 1" })
  .max(5, { message: "O valor deve ser no máximo 5" })
  .optional();

const sensitivity_adjustment = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(30, { message: "O valor deve ser no mínimo 30" })
  .max(1000, { message: "O valor deve ser no máximo 1000" })
  .optional();

const keepAliveSchema = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(60, { message: "O valor deve ser no mínimo 60" })
  .max(1800, { message: "O valor deve ser no máximo 1800" })
  .optional();

const odometer = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .optional();

const horimeter = z.coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })
  .optional();

const max_speed = z.coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(255, { message: "O valor deve ser no máximo 255" })
  .optional();

const angle_adjustment = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(5, { message: "O valor deve ser no mínimmo 5" })
  .max(90, { message: "O valor deve ser no máximo 90" })
  .optional();

const lock_type_progression = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(60000, { message: "O valor deve ser no máximo 60000" });

const ignition_by_voltage = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(65535, { message: "O valor deve ser no máximo 65535" });

const ack = z.coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(180, { message: "O valor deve ser no máximo 180" })
  .optional();

// Esquemas básicos
const dnsSchema = z.object({
  address: z.string(),
  port: z.coerce.number().min(0).max(65535),
});

const ipSchema = z.object({
  ip: z.string().ip(),
  port: z.coerce.number().min(0).max(65535),
});

const apnSchema = z.object({
  address: z.string(),
  user: z.string(),
  password: z.string().optional(),
});

// Esquema para Configuração Geral
export const generalConfigSchema = z.object({
  ip_primary: ipSchema.optional(),
  ip_secondary: ipSchema.optional(),
  dns_primary: dnsSchema.optional(),
  dns_secondary: dnsSchema.optional(),
  apn: apnSchema.optional(),
  data_transmission_on: z.coerce.number().optional(),
  data_transmission_off: z.coerce.number().optional(),
  keep_alive: keepAliveSchema.optional(),
});

// Esquema para E3Plus
export const e3PlusConfigSchema = z.object({
  password: password,
  timezone: z.number().optional(),
  lock_type: z.coerce.number().optional(),
  odometer: odometer,
  accelerometer_sensitivity: z.coerce.number().optional(),
  economy_mode: z.coerce.number().optional(),
  sensitivity_adjustment: sensitivity_adjustment,
  lbs_position: z.coerce.boolean().optional().default(false),
  cornering_position_update: z.coerce.boolean().optional().default(false),
  ignition_alert_power_cut: z.coerce.boolean().optional().default(false),
  gprs_failure_alert: z.coerce.boolean().optional().default(false),
  led: z.coerce.boolean().optional().default(false),
  virtual_ignition: z.coerce.boolean().optional().default(false),
  work_mode: z.string().optional(),
  operation_mode: z.coerce.boolean().optional(),
  max_speed: max_speed,
  sleep: sleep,
});

// Esquema para E3Plus4G
export const e3Plus4GConfigSchema = z.object({
  password: password,
  timezone: z.coerce.number().optional(),
  lock_type: z.coerce.number().optional(),
  odometer: odometer,
  economy_mode: z.coerce.number().optional(),
  sensitivity_adjustment: sensitivity_adjustment,
  lbs_position: z.coerce.boolean().optional().default(false),
  cornering_position_update: z.coerce.boolean().optional().default(false),
  led: z.coerce.boolean().optional().default(false),
  virtual_ignition: z.coerce.boolean().optional().default(false),
  virtual_ignition_by_voltage: z.coerce.boolean().optional().default(false),
  virtual_ignition_by_movement: z.coerce.boolean().optional().default(false),
  max_speed: max_speed,
  communication_type: z.string().optional(),
  protocol_type: z.string().optional(),
  anti_theft: z.coerce.boolean().optional().default(false),
  horimeter: horimeter,
  jammer_detection: z.coerce.boolean().optional().default(false),
  clear_buffer: z.coerce.boolean().optional(),
  clear_horimeter: z.coerce.boolean().optional(),
  input_1: z.number().optional(),
  input_2: z.number().optional(),
  angle_adjustment: angle_adjustment,
  lock_type_progression: z
    .object({
      n1: lock_type_progression,
      n2: lock_type_progression,
    })
    .optional(),
  ignition_by_voltage: z
    .object({
      t1: ignition_by_voltage,
      t2: ignition_by_voltage,
    })
    .refine((data) => data.t1 !== undefined && data.t2 !== undefined, {
      message: "VION e VIOFF devem ser preenchidos.",
      path: ["t1"],
    })
    .refine((data) => data.t1! > data.t2!, {
      message: "VION deve ser maior do que VIOFF.",
      path: ["t1"],
    })
    .optional(),
  ack: ack,
  ignition_status_hb: z.coerce.boolean().optional().default(true),
});

export const nb2ConfigSchema = z.object({
  odometer: odometer,
  data_transmission_event: z.coerce.number().optional(),
  sleep: z.coerce.number().optional(),
  first_voltage: z.coerce.number().optional(),
  second_voltage: z.coerce.number().optional(),
  angle: z.coerce.number().optional(),
  speed: z.coerce.number().optional(),
  accelerometer_sensitivity_on: z.coerce.number().optional(),
  accelerometer_sensitivity_off: z.coerce.number().optional(),
  accelerometer_sensitivity_violated: z.coerce.number().optional(),
  maximum_acceleration: z.coerce.number().optional(),
  maximum_deceleration: z.coerce.number().optional(),
  input_1: z.coerce.number().optional(),
  input_2: z.coerce.number().optional(),
  input_3: z.coerce.number().optional(),
  input_4: z.coerce.number().optional(),
});

export const loraConfigSchema = z.object({
  sleep: z.coerce.number().min(5).max(65534).optional(),
  lorawan_mode_duration: z.coerce.number().min(5).max(65535).optional(),
  lorawan_data_transmission_event: z.coerce
    .number()
    .min(5)
    .max(65534)
    .optional(),
  p2p_mode_duration: z.coerce.number().min(5).max(65535).optional(),
  p2p_data_transmission_event: z.coerce.number().min(5).max(65534).optional(),
  odometer,
  activation_type: z.enum(["ABP", "OTAA"]).optional(),
  virtual_ignition_limits_12v: z
    .object({
      t1: ignition_by_voltage,
      t2: ignition_by_voltage,
    })
    .refine((data) => data.t1 !== undefined && data.t2 !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["t1"],
    })
    .refine((data) => data.t1! > data.t2!, {
      message: "t2 deve ser maior do que t1.",
      path: ["t1"],
    })
    .optional(),
  virtual_ignition_limits_24v: z
    .object({
      t1: ignition_by_voltage,
      t2: ignition_by_voltage,
    })
    .refine((data) => data.t1 !== undefined && data.t2 !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["t1"],
    })
    .refine((data) => data.t1! > data.t2!, {
      message: "t2 deve ser maior do que t1.",
      path: ["t1"],
    })
    .optional(),
  heading: z.boolean().default(false),
  heading_event_mode: z.boolean().default(false),
  heading_detection_angle: z.coerce.number().min(0).max(180).optional(),
  speed_alert_threshold: z.coerce.number().min(5).max(65534).optional(),
  accel_igon_threshold: z.coerce.number().positive().optional(),
  accel_igoff_threshold: z.coerce.number().positive().optional(),
  accel_movement_threshold: z.coerce.number().positive().optional(),
  harsh_acceleration_threshold: z.coerce.number().positive().optional(),
  harsh_braking_threshold: z.coerce.number().positive().optional(),

  full_configuration_table: z.string().optional(),
  full_functionality_table: z.string().optional(),
  led_configuration: z.string().optional(),
  status: z.coerce.number().min(5).max(65534).optional(),
  fifo_send_and_hold_times: z.string().optional(),
  mcu_configuration: z.string().optional(),
  output_table: z.string().optional(),
  input_1: z.coerce.number().optional(),
  input_2: z.coerce.number().optional(),
  input_3: z.coerce.number().optional(),
  input_4: z.coerce.number().optional(),
  input_5: z.coerce.number().optional(),
  input_6: z.coerce.number().optional(),
});

// Esquema principal
const schema = z.object({
  client_id: z.string().optional(),
  technology_id: z.string(),
  name: z.string().min(1),
  type: z.nativeEnum(EType),
  config: z.object({
    general: generalConfigSchema,
    specific: e3PlusConfigSchema
      .merge(e3Plus4GConfigSchema)
      .merge(nb2ConfigSchema)
      .merge(loraConfigSchema)
      .optional(),
  }),
});

type Schema = z.infer<typeof schema>;

export type ConfigurationProfileSchema = Schema;

interface Props {
  technologies: ITechnology[];
}

export function useConfigurationProfileCreateForm(props: Props) {
  const { technologies } = props;
  const [name, setName] = useState<{
    technology?: string;
    document?: string;
    type?: string;
  }>({});

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      config: {
        general: {
          data_transmission_on: 60,
          data_transmission_off: 7200,
          keep_alive: 60,
        },
      },
    },
  });

  const { watch } = form;

  const technology_id = watch("technology_id");

  const technology = useMemo(() => {
    return technologies.find((el) => el.id === technology_id);
  }, [technologies, technology_id]); // Só recalcula se `technology_id` mudar

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        const { client_id, type, technology_id, config } = data;
        await createOneConfigurationProfile({
          name: formatConfigurationProfileName(name),
          client_id,
          technology_id,
          type,
          config,
        });

        toast({
          title: "Sucesso!",
          description: "Perfil registrado com sucesso!",
          variant: "success",
        });
      } catch (e) {
        console.error(e);
        toast({
          title: "Falha!",
          description: "Falha ao registrar o perfil!",
          variant: "error",
        });
      }
    },
    (error) => {
      toast({
        title: "Erro de Validação",
        description:
          "Por favor, corrija os erros no formulário antes de submeter.",
        variant: "error",
      });
    }
  );

  const handleChangeName = (props: {
    type?: string;
    technology?: string;
    document?: string;
  }) => {
    setName((prev) => {
      const state = Object.assign(prev, props);
      form.setValue("name", formatConfigurationProfileName(state));
      return state;
    });
  };

  return {
    form,
    register: form.register,
    handleSubmit,
    handleChangeName,
    technology,
  };
}
