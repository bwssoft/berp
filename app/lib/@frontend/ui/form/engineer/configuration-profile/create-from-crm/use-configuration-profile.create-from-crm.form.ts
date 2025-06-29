import { EType, IClient } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formatConfigurationProfileName,
  generateConfigurationProfileLinkForClient,
} from "../util";
import {
  e3Plus4GConfigSchema,
  e3PlusConfigSchema,
  generalConfigSchema,
} from "../upsert/use-configuration-profile.upsert.form";
import { createOneConfigurationProfile } from "@/app/lib/@backend/action/engineer/configuration-profile.action";

// Esquema principal
const schema = z.object({
  client_id: z.string().optional(),
  technology_id: z.string(),
  name: z.string().min(1),
  type: z.nativeEnum(EType),
  config: z.object({
    general: generalConfigSchema,
    specific: z
      .intersection(e3PlusConfigSchema, e3Plus4GConfigSchema)
      .optional(),
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
      config: {
        general: {
          data_transmission_on: 60,
          data_transmission_off: 43200,
          keep_alive: 60,
        },
      },
    },
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { type, technology_id, config } = data;
        const configurationProfileCreated = await createOneConfigurationProfile(
          {
            name: formatConfigurationProfileName(name),
            client_id: client.id,
            technology_id,
            type,
            config,
          }
        );
        if (!configurationProfileCreated) {
          toast({
            title: "Falha!",
            description: "Falha ao registrar o perfil!",
            variant: "error",
          });
          return;
        }
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
