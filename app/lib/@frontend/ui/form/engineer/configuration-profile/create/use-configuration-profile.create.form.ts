import { createOneConfigurationProfile } from "@/app/lib/@backend/action";
import { EType, EUseCase, ITechnology } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../util";

const password = z
  .string()
  .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
  .optional();

const data_transmission = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })
  .optional();

const ip = z.string().ip({ message: "IP inválido." }).optional();

const port = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .optional();

const sensitivity_adjustment = z.coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(30, { message: "O valor deve ser no mínimo 30" })
  .max(1000, { message: "O valor deve ser no máximo 1000" })
  .optional();

const keep_alive = z.coerce
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
  port: z.number().min(0).max(65535),
});

const ipSchema = z.object({
  ip: z.string().ip(),
  port: z.number().min(0).max(65535),
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
  data_transmission_on: z.number().optional(),
  data_transmission_off: z.number().optional(),
  keep_alive: z.number().optional(),
});

// Esquema para E3Plus
export const e3PlusConfigSchema = z.object({
  password: z
    .object({
      old: z.string().optional(),
      new: z.string().optional(),
    })
    .optional(),
  timezone: z.number().optional(),
  // ... outros campos do E3Plus
});

// Esquema para E3Plus4G
export const e3Plus4GConfigSchema = z.object({
  password: z
    .object({
      old: z.string().optional(),
      new: z.string().optional(),
    })
    .optional(),
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

// Esquema principal
export const schema = z.object({
  id: z.string(),
  client_id: z.string(),
  technology_id: z.string(),
  use_case: z.nativeEnum(EUseCase),
  name: z.string().min(1),
  type: z.nativeEnum(EType),
  config: z.object({
    general: generalConfigSchema,
    specific: z
      .intersection(e3PlusConfigSchema, e3Plus4GConfigSchema)
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

  const methods = useForm<Schema>({
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

  const { watch } = methods;

  const technology_id = watch("technology_id");

  const technology = useMemo(() => {
    return technologies.find((el) => el.id === technology_id);
  }, [technologies, technology_id]); // Só recalcula se `technology_id` mudar

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      try {
        const { client_id, type, use_case, technology_id, config } = data;
        await createOneConfigurationProfile({
          name: formatConfigurationProfileName(name),
          client_id,
          technology_id,
          type,
          use_case,
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
    () => {
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
  }) => setName((prev) => Object.assign(prev, props));

  return {
    methods,
    register: methods.register,
    handleSubmit,
    handleChangeName,
    technology,
  };
}
