import { updateOneConfigurationProfileById } from "@/app/lib/@backend/action";
import {
  EType,
  EUseCase,
  IConfigurationProfile,
} from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string({ message: "O nome é orbigatório" }),
  client_id: z.string({ message: "O cliente é orbigatório" }),
  type: z.nativeEnum(EType),
  use_case: z.nativeEnum(EUseCase),
  technology_id: z.string(),

  //auth
  password: z
    .object({
      old: z
        .string()
        .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
        .optional(),
      new: z
        .string()
        .max(6, { message: "A senha deve ter no máximo 6 caracteres." })
        .optional(),
    })
    .optional(),

  // network
  apn: z
    .object({
      address: z.string(),
      user: z.string(),
      password: z.string(),
    })
    .optional(),
  ip: z
    .object({
      primary: z
        .object({
          ip: z.string().ip({ message: "IP inválido." }),
          port: z.coerce
            .number()
            .positive({ message: "O valor deve ser positivo" }),
        })
        .refine(
          (data) =>
            (!data?.ip?.length && !data?.port) || (data?.ip && data.port),
          {
            message:
              "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
          }
        ),
      secondary: z
        .object({
          ip: z.string().ip({ message: "IP inválido." }),
          port: z.coerce
            .number()
            .positive({ message: "O valor deve ser positivo" }),
        })
        .refine(
          (data) =>
            (!data?.ip?.length && !data?.port) || (data?.ip && data.port),
          {
            message:
              "Ambos 'ip' e 'port' devem estar preenchidos ou ambos devem estar ausentes.",
          }
        ),
    })
    .optional(),
  dns: z
    .object({
      address: z.string(),
      port: z.coerce
        .number()
        .positive({ message: "O valor deve ser positivo" }),
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
  defaultValues: IConfigurationProfile;
}

export function useConfigurationProfileUpdateForm(props: Props) {
  const {
    defaultValues: { id, client_id, name, technology_id, use_case, ...config },
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
      name,
      technology_id,
      use_case,
      data_transmission: { on: 60, off: 7200 },
      keep_alive: 60,
      timezone: 0,
      ...config,
    },
  });

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        const { name, client_id, type, use_case, technology_id, ...config } =
          data;
        updateOneConfigurationProfileById(
          { id: id },
          { name, client_id, type, use_case, technology_id, config }
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

  return {
    register,
    handleSubmit,
    control,
    setValue,
    reset: hookFormReset,
    watch,
    formState,
  };
}
