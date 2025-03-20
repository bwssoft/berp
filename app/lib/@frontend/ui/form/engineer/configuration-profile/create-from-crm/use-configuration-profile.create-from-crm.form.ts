import { createOneConfigurationProfile } from "@/app/lib/@backend/action";
import { EType, EUseCase, IClient } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formatConfigurationProfileName,
  generateConfigurationProfileLinkForClient,
} from "../util";

const schema = z.object({
  type: z.nativeEnum(EType),
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

interface Props {
  client: IClient;
}

export function useConfigurationProfileCreateFromCrmForm(props: Props) {
  const { client } = props;

  const [configurationProfileId, setConfigurationProfileId] =
    useState<string>();

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
        data_transmission_off: 43200,
        keep_alive: 60,
      },
    },
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { type, technology_id, ...config } = data;
        const configurationProfileCreated = await createOneConfigurationProfile(
          {
            name: formatConfigurationProfileName(name),
            client_id: client.id,
            technology_id,
            type,
            use_case: EUseCase["CLIENT"],
            config,
          }
        );
        setConfigurationProfileId(configurationProfileCreated.id);
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

  const handleClientLinkGeneration = useCallback(async () => {
    configurationProfileId &&
      (await generateConfigurationProfileLinkForClient(configurationProfileId));
  }, [configurationProfileId]);

  useEffect(
    () => handleChangeName({ document: client.document.value }),
    [client]
  );

  return {
    register,
    handleSubmit,
    control,
    setValue,
    reset: hookFormReset,
    watch,
    formState,
    handleChangeName,
    handleClientLinkGeneration,
  };
}
