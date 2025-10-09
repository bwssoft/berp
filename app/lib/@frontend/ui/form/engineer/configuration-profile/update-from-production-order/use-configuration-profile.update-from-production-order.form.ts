import {EType, IConfigurationProfile} from "@/backend/domain/engineer/entity/configuration-profile.definition";
import {IClient} from "@/backend/domain/commercial/entity/client.definition";
import {ITechnology} from "@/backend/domain/engineer/entity/technology.definition";
import {} from "@/backend/domain/admin/entity/control.definition";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatConfigurationProfileName } from "../util";
import {
  e3Plus4GConfigSchema,
  e3PlusConfigSchema,
  generalConfigSchema,
  loraConfigSchema,
  nb2ConfigSchema,
} from "../upsert/use-configuration-profile.upsert.form";
import { updateOneConfigurationProfileById } from "@/backend/action/engineer/configuration-profile.action";

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

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IConfigurationProfile;
  client: IClient;
  technology: ITechnology;
}

export function useConfigurationProfileUpdateFromProductionOrderForm(
  props: Props
) {
  const [name, setName] = useState<{
    technology?: string;
    document?: string;
    type?: string;
  }>({});

  const {
    defaultValues: { id, client_id, type, technology_id, config },
    client,
    technology,
  } = props;

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
      client_id,
      technology_id,
      type,
      config: {
        general: {
          data_transmission_on: 60,
          data_transmission_off: 7200,
          keep_alive: 60,
          ...config.general,
        },
      },
    },
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { client_id, type, technology_id, config } = data;
        await updateOneConfigurationProfileById(
          { id: id },
          {
            name: formatConfigurationProfileName(name),
            client_id,
            type,
            technology_id,
            config,
          }
        );
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

  useEffect(
    () =>
      handleChangeName({
        type: type,
        document: client.document.value,
        technology: technology.name.brand,
      }),
    [client, technology, type]
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
  };
}

