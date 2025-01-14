import { createOneConfigurationProfile } from "@/app/lib/@backend/action";
import { EModel, EType } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { removeEmptyValues, removeUndefined } from "@/app/lib/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const password = z
  .string()
  .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
  .optional()

const data_transmission = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })
  .optional()

const ip = z
  .string()
  .ip({ message: "IP inválido." })
  .optional()

const port = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .optional()

const sensitivity_adjustment = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(30, { message: "O valor deve ser no mínimo 30" })
  .max(1000, { message: "O valor deve ser no máximo 1000" })
  .optional()

const keep_alive = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(60, { message: "O valor deve ser no mínimo 60" })
  .max(1800, { message: "O valor deve ser no máximo 1800" })
  .optional()

const odometer = z
  .coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })
  .optional()

const horimeter = z
  .coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })
  .optional()

const max_speed = z
  .coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(255, { message: "O valor deve ser no máximo 255" })
  .optional()

const angle_adjustment = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .min(5, { message: "O valor deve ser no mínimmo 5" })
  .max(90, { message: "O valor deve ser no máximo 90" })
  .optional()

const lock_type_progression = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(60000, { message: "O valor deve ser no máximo 60000" })

const ignition_by_voltage = z
  .coerce
  .number()
  .positive({ message: "O valor deve ser positivo" })
  .max(65535, { message: "O valor deve ser no máximo 65535" })


const ack = z
  .coerce
  .number()
  .min(0, { message: "O valor deve ser no mínimo 0" })
  .max(180, { message: "O valor deve ser no máximo 180" })
  .optional()

const removePropByOptionalFunctions = <T>(schema: T) => {
  const optional_functions = (schema as any).optional_functions
  if (!optional_functions) return schema
  const parsed = JSON.parse(JSON.stringify(schema))
  Object.entries(optional_functions).forEach(([key, value]) => {
    if (!value) {
      delete parsed[key]
    }
  })
  return parsed as T
}

const schema = z.preprocess(removeEmptyValues, z
  .object({
    name: z.string({ message: "O nome é orbigatório" }),
    client_id: z.string({ message: "O cliente é orbigatório" }),
    type: z.nativeEnum(EType),
    password: z.object({ old: password, new: password }).optional(),
    apn: z
      .object({
        address: z.string().optional(),
        user: z.string().optional(),
        password: z.string().optional(),
      })
      .optional(),
    ip: z
      .object({
        primary: z.object({
          ip: ip,
          port: port,
        }).optional().refine(
          (data) => (!data?.ip?.length && !data?.port) || (data?.ip && data.port),
          { message: "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes." }
        ),
        secondary: z.object({
          ip: ip,
          port: port,
        }).optional().refine(
          (data) => (!data?.ip?.length && !data?.port) || (data?.ip && data.port),
          { message: "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes." }
        ),
      })
      .optional(),
    dns: z
      .object({
        address: z.string().optional(),
        port: port,
      })
      .optional(),
    timezone: z.coerce.number().optional(),
    lock_type: z.coerce.number().optional(),
    data_transmission: z
      .object({
        on: data_transmission,
        off: data_transmission,
      })
      .optional(),
    odometer: odometer,
    keep_alive: keep_alive,
    economy_mode: z.coerce.number().optional(),
    sensitivity_adjustment: sensitivity_adjustment,
    lbs_position: z.coerce.boolean().optional().default(false),
    cornering_position_update: z.coerce.boolean().optional().default(false),
    led: z.coerce.boolean().optional().default(false),
    virtual_ignition: z.coerce.boolean().optional().default(false),
    virtual_ignition_by_voltage: z.coerce.boolean().optional().default(false),
    virtual_ignition_by_movement: z.coerce.boolean().optional().default(false),
    optional_functions: z.record(z.string(), z.boolean()).optional(),
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
        path: ["t1"]
      })
      .refine((data) => data.t1! > data.t2!, {
        message: "VION deve ser maior do que VIOFF.",
        path: ["t1"]
      }).optional(),
    ack: ack,
    ignition_status_hb: z.coerce.boolean().optional().default(true),
  })).transform(removeUndefined).transform(removePropByOptionalFunctions)

export type Schema = z.infer<typeof schema>;

export function useE3Plus4GConfigurationProfileCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const [ipdns, setIpdns] = useState<"IP" | "DNS">("IP");
  const handleChangeIpDns = (value: "IP" | "DNS") => {
    setIpdns(value);
  };

  const lockType = watch("lock_type")

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { name, optional_functions, client_id, type, ...config } = data;
        await createOneConfigurationProfile({
          name,
          config,
          optional_functions,
          model: EModel.DM_E3_PLUS_4G,
          client_id,
          type
        });
        toast({
          title: "Sucesso!",
          description: "Perfil registrado com sucesso!",
          variant: "success",
        })
      } catch (e) {
        console.error(e)
        toast({
          title: "Falha!",
          description: "Falha ao registrar o perfil!",
          variant: "error",
        })
      }
    },
    () => {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário antes de submeter.",
        variant: "error",
      });
    });

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    handleChangeIpDns,
    ipdns,
    lockType,
    watch,
  };
}
