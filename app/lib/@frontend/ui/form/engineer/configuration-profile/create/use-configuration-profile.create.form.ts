import { createOneConfigurationProfile } from "@/app/lib/@backend/action";
import { EType, EUseCase } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../util";

const schema = z.object({
  client_id: z.string({ message: "O cliente é obrigatório" }),
  type: z.nativeEnum(EType),
  use_case: z.nativeEnum(EUseCase),
  technology_id: z.string(),

  general: z.object({
    // network
    apn: z
      .object({
        address: z.string(),
        user: z.string(),
        password: z.string().optional(),
      })
      .optional(),
    ip_primary: z
      .object({
        ip: z.string().ip({ message: "IP inválido." }),
        port: z.coerce.number(),
      })
      .refine((data) => (!data.ip && !data.port) || (data.ip && data.port), {
        message:
          "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
      })
      .optional(),
    ip_secondary: z
      .object({
        ip: z.string().ip({ message: "IP inválido." }),
        port: z.coerce.number(),
      })
      .refine((data) => (!data.ip && !data.port) || (data.ip && data.port), {
        message:
          "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
      })
      .optional(),
    dns_primary: z
      .object({
        address: z.string(),
        port: z.number(),
      })
      .optional(),
    data_transmission_on: z.coerce
      .number()
      .positive({ message: "O valor deve ser positivo" })
      .max(65535, { message: "O valor deve ser no máximo 65535" })
      .default(60),
    data_transmission_off: z.coerce
      .number()
      .positive({ message: "O valor deve ser positivo" })
      .max(65535, { message: "O valor deve ser no máximo 65535" })
      .default(1800),
    keep_alive: z.coerce
      .number()
      .positive({ message: "O valor deve ser positivo" })
      .min(60, { message: "O valor deve ser no mínimo 60" })
      .max(1800, { message: "O valor deve ser no máximo 1800" })
      .default(60),
  }),
});

export type Schema = z.infer<typeof schema>;

export function useConfigurationProfileCreateForm() {
  const [name, setName] = useState<{
    technology?: string;
    document?: string;
    type?: string;
  }>({});

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState,
    control,
    setValue,
    watch,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      general: {
        data_transmission_on: 60,
        data_transmission_off: 7200,
        keep_alive: 60,
      },
    },
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { client_id, type, use_case, technology_id, ...config } = data;
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
    register,
    handleSubmit,
    control,
    setValue,
    reset: hookFormReset,
    watch,
    formState,
    handleChangeName,
  };
}
