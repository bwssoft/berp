import { createOneHistorical } from "@/app/lib/@backend/action";
import { useAuth } from "@/app/lib/@frontend/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  description: z.string()
})

type CreateHistoricalFormSchema = z.infer<typeof schema>;

type Props = {
  accountId: string
}

export function useCreateHistoricalForm({accountId}:Props) {

  const {handleSubmit, register} = useForm<CreateHistoricalFormSchema>({
    resolver: zodResolver(schema)
  })
  const {user} = useAuth()

  const onSubmit = handleSubmit(async (data) => {
    await createOneHistorical({
      ...data,
      accountId: accountId,
      title: "teste",
      type: "cadastro",
      author: {
        name: user?.name ?? "",
        avatarUrl: ""
      },
    })
  })
  
  return {
    onSubmit,
    register
  }
}
