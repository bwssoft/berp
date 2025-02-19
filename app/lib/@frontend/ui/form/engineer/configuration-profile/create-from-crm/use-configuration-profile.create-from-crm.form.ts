import {
  createOneConfigurationProfile,
  updateOneConfigurationProfileById,
} from "@/app/lib/@backend/action";
import {
  EType,
  EUseCase,
  IClient,
  IConfigurationProfile,
  ITechnology,
} from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  emptyStringToUndefined,
  formatConfigurationProfileName,
  generateConfigurationProfileLinkForClient,
  optionalNumber,
  optionalString,
} from "../util";

const schema = z.object({
  type: z.nativeEnum(EType),
  technology_id: z.string(),

  // auth
  password: z
    .object({
      old: z.preprocess(
        emptyStringToUndefined,
        z
          .string()
          .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
          .optional()
      ),
      new: z.preprocess(
        emptyStringToUndefined,
        z
          .string()
          .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
          .optional()
      ),
    })
    .optional(),

  // network
  apn: z
    .object({
      address: optionalString,
      user: optionalString,
      password: optionalString,
    })
    .optional(),

  ip: z
    .object({
      primary: z
        .object({
          // Aqui usamos um refinamento para validar IP caso exista
          ip: optionalString.refine(
            (val) =>
              val === undefined ||
              z.string().ip({ message: "IP inválido." }).safeParse(val).success,
            { message: "IP inválido." }
          ),
          port: optionalNumber,
        })
        .refine((data) => (!data.ip && !data.port) || (data.ip && data.port), {
          message:
            "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
        }),
      secondary: z
        .object({
          ip: optionalString.refine(
            (val) =>
              val === undefined ||
              z.string().ip({ message: "IP inválido." }).safeParse(val).success,
            { message: "IP inválido." }
          ),
          port: optionalNumber,
        })
        .refine((data) => (!data.ip && !data.port) || (data.ip && data.port), {
          message:
            "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
        }),
    })
    .optional(),

  dns: z
    .object({
      address: optionalString,
      port: optionalNumber,
    })
    .optional(),

  data_transmission: z
    .object({
      on: z.coerce
        .number()
        .positive({ message: "O valor deve ser positivo" })
        .max(65535, { message: "O valor deve ser no máximo 65535" })
        .default(60),
      off: z.coerce
        .number()
        .positive({ message: "O valor deve ser positivo" })
        .max(65535, { message: "O valor deve ser no máximo 65535" })
        .default(1800),
    })
    .optional(),

  timezone: z.coerce.number().optional(),
  keep_alive: z.coerce
    .number()
    .positive({ message: "O valor deve ser positivo" })
    .min(60, { message: "O valor deve ser no mínimo 60" })
    .max(1800, { message: "O valor deve ser no máximo 1800" })
    .default(60),
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
      data_transmission: { on: 60, off: 43200 },
      keep_alive: 60,
      timezone: 0,
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
