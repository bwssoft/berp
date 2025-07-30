import {
  Device,
  EType,
  IClient,
  IConfigurationProfile,
  ITechnology,
} from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../util";
import {
  createOneConfigurationProfile,
  updateOneConfigurationProfileById,
} from "@/app/lib/@backend/action/engineer/configuration-profile.action";

const twoBytesSchema = z.coerce
  .number()
  .int()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(65535, { message: "O valor deve ser no máximo 65535" });

const oneBytesSchema = z.coerce
  .number()
  .int()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(255, { message: "O valor deve ser no máximo 255" });

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
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .optional();

const angle_adjustment = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(5, { message: "O valor deve ser no mínimmo 5" })
  .max(90, { message: "O valor deve ser no máximo 90" })
  .optional();

const ack = z.coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(180, { message: "O valor deve ser no máximo 180" })
  .optional();

// Esquemas básicos
const dnsSchema = z.object({
  address: z.string(),
  port: twoBytesSchema,
});

const ipSchema = z.object({
  ip: z.string().ip(),
  port: twoBytesSchema,
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
  max_speed: oneBytesSchema.optional(),
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
  anti_theft: z.coerce.boolean().optional().default(false),
  jammer_detection: z.coerce.boolean().optional().default(false),
  max_speed: oneBytesSchema.optional(),
  communication_type: z.string().optional(),
  protocol_type: z.string().optional(),
  horimeter: twoBytesSchema.optional(),
  clear_buffer: z.coerce.boolean().optional(),
  clear_horimeter: z.coerce.boolean().optional(),
  input_1: z.number().optional(),
  input_2: z.number().optional(),
  angle_adjustment: angle_adjustment,
  lock_type_progression: z
    .object({
      n1: twoBytesSchema,
      n2: twoBytesSchema,
    })
    .optional(),
  ignition_by_voltage: z
    .object({
      initial: twoBytesSchema,
      final: twoBytesSchema,
    })
    .refine((data) => data.initial !== undefined && data.final !== undefined, {
      message: "VION e VIOFF devem ser preenchidos.",
      path: ["initial"],
    })
    .refine((data) => data.initial! > data.final!, {
      message: "VION deve ser maior do que VIOFF.",
      path: ["initial"],
    })
    .optional(),
  ack: ack,
  ignition_status_hb: z.coerce.boolean().optional().default(true),
});

export const nb2ConfigSchema = z.object({
  data_transmission_event: twoBytesSchema.optional(),
  odometer,
  time_to_sleep: twoBytesSchema.optional(),
  virtual_ignition_12v: z
    .object({
      initial: twoBytesSchema,
      final: twoBytesSchema,
    })
    .refine((data) => data.initial !== undefined && data.final !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["initial"],
    })
    .refine((data) => data.initial < data.final, {
      message: "O valor final deve ser maior do que inicial.",
      path: ["initial"],
    })
    .optional(),
  virtual_ignition_24v: z
    .object({
      initial: twoBytesSchema,
      final: twoBytesSchema,
    })
    .refine((data) => data.initial !== undefined && data.final !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["initial"],
    })
    .refine((data) => data.initial < data.final, {
      message: "O valor final deve ser maior do que inicial.",
      path: ["initial"],
    })
    .optional(),
  lock_type: z.coerce.number().optional(),
  economy_mode: z.coerce.number().optional(),
  heading_detection_angle: z.coerce.number().min(0).max(180).optional(),
  speed_alert_threshold: oneBytesSchema.optional(),
  accel_threshold_for_ignition_on: oneBytesSchema.optional(),
  accel_threshold_for_ignition_off: oneBytesSchema.optional(),
  accel_threshold_for_movement: twoBytesSchema.optional(),
  harsh_acceleration_threshold: twoBytesSchema.optional(),
  harsh_braking_threshold: twoBytesSchema.optional(),
  input_1: z.coerce.number().optional(),
  input_2: z.coerce.number().optional(),
  input_3: z.coerce.number().optional(),
  input_4: z.coerce.number().optional(),
});

export const loraConfigSchema = z.object({
  data_transmission_sleep: twoBytesSchema.optional(),
  data_transmission_position: twoBytesSchema.optional(),
  lorawan_mode_duration: twoBytesSchema.optional(),
  data_transmission_status: twoBytesSchema.optional(),
  lorawan_data_transmission_event: twoBytesSchema.optional(),
  p2p_mode_duration: twoBytesSchema.optional(),
  p2p_data_transmission_event: twoBytesSchema.optional(),
  odometer,
  activation_type: z.enum(["00", "01"]).optional(),
  virtual_ignition_12v: z
    .object({
      initial: twoBytesSchema,
      final: twoBytesSchema,
    })
    .refine((data) => data.initial !== undefined && data.final !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["initial"],
    })
    .refine((data) => data.initial < data.final, {
      message: "O valor final deve ser maior do que inicial.",
      path: ["initial"],
    })
    .optional(),
  virtual_ignition_24v: z
    .object({
      initial: twoBytesSchema,
      final: twoBytesSchema,
    })
    .refine((data) => data.initial !== undefined && data.final !== undefined, {
      message: "Os intervalos devem ser preenchidos.",
      path: ["initial"],
    })
    .refine((data) => data.initial < data.final, {
      message: "O valor final deve ser maior do que inicial.",
      path: ["initial"],
    })
    .optional(),
  heading: z.boolean().default(false),
  heading_event_mode: z.boolean().default(false),
  heading_detection_angle: z.coerce.number().min(0).max(180).optional(),
  speed_alert_threshold: oneBytesSchema.optional(),
  accel_threshold_for_ignition_on: oneBytesSchema.optional(),
  accel_threshold_for_ignition_off: oneBytesSchema.optional(),
  accel_threshold_for_movement: twoBytesSchema.optional(),
  harsh_acceleration_threshold: twoBytesSchema.optional(),
  harsh_braking_threshold: twoBytesSchema.optional(),

  full_configuration_table: z.string().optional(),
  full_functionality_table: z.string().optional(),
  fifo_send_and_hold_times: z.string().optional(),
  mcu_configuration: z.string().optional(),
  output_table: z.string().optional(),
  input_1: z.coerce.number().optional(),
  input_2: z.coerce.number().optional(),
  input_3: z.coerce.number().optional(),
  input_4: z.coerce.number().optional(),
  input_5: z.coerce.number().optional(),
  input_6: z.coerce.number().optional(),
  led_lighting: z.string().optional(),
});

export type TechnologySystemName =
  | Device.Model.DM_E3_PLUS
  | Device.Model.DM_E3_PLUS_4G
  | Device.Model.DM_BWS_NB2
  | Device.Model.DM_BWS_LORA;

const schema = z.object({
  id: z.string().optional(),
  client_id: z.string().optional(),
  technology_id: z.string(),
  name: z.string().min(1),
  type: z.nativeEnum(EType),
  config: z.object({
    general: generalConfigSchema.optional(),
    specific: z
      .discriminatedUnion("technology_system_name", [
        e3Plus4GConfigSchema.extend({
          technology_system_name: z.literal(Device.Model.DM_E3_PLUS_4G),
        }),
        e3PlusConfigSchema.extend({
          technology_system_name: z.literal(Device.Model.DM_E3_PLUS),
        }),
        nb2ConfigSchema.extend({
          technology_system_name: z.literal(Device.Model.DM_BWS_NB2),
        }),
        loraConfigSchema.extend({
          technology_system_name: z.literal(Device.Model.DM_BWS_LORA),
        }),
      ])
      .optional(),
  }),
});

export type ConfigurationProfileSchema = z.infer<typeof schema>;

type ProfileName = {
  type?: string;
  technology?: string;
  document?: string;
};

export interface Props {
  clients: IClient[];
  technologies: ITechnology[];
  defaultValues?: {
    configurationProfile: IConfigurationProfile;
    client: IClient;
    technology: ITechnology;
  };
}

export function useConfigurationProfileUpsertForm(props: Props) {
  const { technologies, defaultValues } = props;

  const [name, setName] = useState<ProfileName>({});

  const form = useForm<ConfigurationProfileSchema>({
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
    shouldUnregister: true,
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      const { id } = data;

      const config = {
        general: { ...data.config.general },
        specific: { ...data.config.specific },
      };

      delete (config.specific as any)?.technology_system_name;

      const profile = {
        ...data,
        name: formatConfigurationProfileName(name),
        config,
      };

      try {
        if (id) {
          await updateOneConfigurationProfileById({ id }, profile);

          toast({
            title: "Perfil Atualizado!",
            description: "As configurações foram atualizadas com sucesso.",
            variant: "success",
          });
        } else {
          await createOneConfigurationProfile(profile);

          toast({
            title: "Perfil Criado!",
            description: "Novo perfil criado com sucesso.",
            variant: "success",
          });
        }
      } catch (error) {
        console.error("Erro ao registrar perfil:", error);

        toast({
          title: "Erro!",
          description: id
            ? "Falha ao atualizar o perfil."
            : "Falha ao criar o novo perfil.",
          variant: "error",
        });
      }
    },
    (error) => {
      console.error("Erro de validação ao registrar perfil");
      console.error(error);
      console.error(form.watch());
      toast({
        title: "Erro de Validação",
        description: "Revise os campos obrigatórios e tente novamente.",
        variant: "error",
      });
    }
  );

  const handleChangeName = (props: ProfileName) => {
    setName((prev) => {
      const state = Object.assign(prev, props);
      form.setValue("name", formatConfigurationProfileName(state));
      return state;
    });
  };

  const handleChangeTechnology = (technology_id: string) => {
    const selected = technologies.find((t) => t.id === technology_id);
    if (selected) {
      handleChangeName({
        technology: selected.name.brand,
      });

      switch (selected.name.system) {
        case Device.Model["DM_BWS_LORA"]:
          form.unregister(`config.general`);
          form.unregister(`config.specific`);
          break;
        case Device.Model["DM_BWS_NB2"]:
          form.unregister(`config.specific`);
          break;
        case Device.Model["DM_E3_PLUS_4G"]:
          form.unregister(`config.specific`);
          break;
        case Device.Model["DM_E3_PLUS"]:
          form.unregister(`config.specific`);
          break;
        default:
          break;
      }

      form.setValue(
        "config.specific.technology_system_name",
        selected.name.system as TechnologySystemName
      );
    }
  };

  const technology_id = form.watch("technology_id");

  const technology = useMemo(() => {
    return technologies.find((el) => el.id === technology_id);
  }, [technologies, technology_id]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues.configurationProfile);
      form.setValue(
        "config.specific.technology_system_name",
        defaultValues.technology.name.system as TechnologySystemName
      );
      handleChangeName({
        document: defaultValues.client.document.value,
        technology: defaultValues.technology.name.brand,
        type: defaultValues.configurationProfile.type,
      });
    }
  }, [defaultValues]);

  return {
    form,
    register: form.register,
    handleSubmit,
    handleChangeName,
    technology,
    handleChangeTechnology,
  };
}
