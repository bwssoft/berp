import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneCommand } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
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

export function useCommandCreateForm() {
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

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneCommand(data);
      toast({
        title: "Sucesso!",
        description: "Firmware registrado com sucesso!",
        variant: "success",
      });
      hookFormReset({ data: "", name: "", description: "", variables: {} })
    } catch (e) {
      console.log(e)
      toast({
        title: "Erro!",
        description: "Falha ao registrar o firmware!",
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
