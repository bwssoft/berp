import { createOneInputCategory } from "@/app/lib/@backend/action"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/app/lib/@frontend/hook"

const schema = z.object({
  name: z.string().min(1, 'Esse campo não pode ser vazio'),
  code: z.string().min(1, 'Esse campo não pode ser vazio')
})

export type InputCategoryCreateSchema = z.infer<typeof schema>

export function useInputCategoryCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
  } = useForm<InputCategoryCreateSchema>({
    resolver: zodResolver(schema)
  })

  const handleSubmit = hookFormSubmit(async function onSuccess(data) {
    try {
      await createOneInputCategory(data);
      toast({
        title: "Sucesso!",
        description: "Categoria de insumo registrada com sucesso!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o insumo!",
        variant: "error",
      })
    }
  })

  return {
    handleSubmit,
    register,
  }
}