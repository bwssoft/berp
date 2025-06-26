"use client"
import { createOneHistorical } from "@/app/lib/@backend/action";
import { ContactSelection } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { useCreateAnnexHistoricalModal } from "@/app/lib/@frontend/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  const { openModal, open, closeModal } = useCreateAnnexHistoricalModal()
  const {user} = useAuth()
  const [file, setFile] = useState<string[] | undefined>()
  const [selectContact, setSelectContact] = useState<ContactSelection[]>([]);

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
      file: file, 
      contacts: selectContact
    })
  })

  const handleFileChange = (url: string) => {
    setFile(prev => [ ...(prev ?? []), url ])
    closeModal()
  }
  
  return {
    onSubmit,
    register,
    handleFileChange, 
    file,
    openModal,
    open,
    setSelectContact,
    selectContact,
    closeModal
  }
}
