import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { updateOneCommandById } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { ICommand } from '@/app/lib/@backend/domain';
import { findByRegex } from '@/app/lib/util';

const schema = z.object({
  name: z.string(),
  data: z.string(),
  description: z.string().min(1, 'Esse campo não pode ser vazio'),
  variables: z.record(z.string(), z.string()).transform((vars) => {
    return Object.fromEntries(
      Object.entries(vars).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );
  }).optional()
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: ICommand
}
export function useCommandUpdateForm(props: Props) {
  const { defaultValues } = props

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateOneCommandById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Comando atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.log(e)
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o comando!",
        variant: "error",
      });
    }
  });


  const watchedData = watch("data")
  const watchedVaribles = watch("variables")

  const variables = findByRegex(watchedData, /{{.+?}}/g)
    .reduce((acc, cur) => {
      const key = `var_${cur}`
      const value = watchedVaribles?.[key] || ""
      return { ...acc, [key]: value }
    }, {})

  const replaceVariables = (str: string, vars: Record<string, string>) => {
    if (!str) return
    return str.replace(/{{(\d+)}}/g, (match, p1) => {
      const key = `var_${p1}`;
      return vars[key] || match;
    });
  };

  const commandPreview = replaceVariables(watchedData, variables)

  useEffect(() => {
    console.log('errors', errors)
  }, [errors])


  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    variables: Object.entries(variables),
    commandPreview
  };
}
