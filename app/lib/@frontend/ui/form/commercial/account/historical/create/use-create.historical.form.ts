import { createOneHistorical } from "@/app/lib/@backend/action";
import { ContactSelection } from "@/app/lib/@backend/domain";
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
  selectContact: ContactSelection[]
}

export function useCreateHistoricalForm({accountId, selectContact}:Props) {

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
      action: "n45656",
      author: {
        name: user?.name ?? "",
        avatarUrl: ""
      },
      contacts: selectContact
    })
  })
  
  return {
    onSubmit,
    register
  }
}
