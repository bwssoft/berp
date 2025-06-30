"use client"

import { IContact } from "@/app/lib/@backend/domain"
import { Phone, Mail, Edit, Trash2, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Dialog } from "../../../component"
import { UpdateContactModal, useUpdateContactModal } from "../../../modal"
import { useState } from "react"
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action"
import { toast } from "@/app/lib/@frontend/hook"
import { useQueryClient } from "@tanstack/react-query"
import { Separator } from "@radix-ui/react-select"

interface ContactCardProps {
  contact: IContact
  accountId: string
}

const getContactIcon = (type: IContact["contactItems"][number]["type"], preferred: IContact["contactItems"][number]["preferredContact"]) => {
  const isPreferred = (type === "Celular" && preferred.whatsapp) ||
                      ((type === "Celular" || type.includes("Telefone")) && preferred.phone) ||
                      (type === "Email" && preferred.email)

  const iconClass = `h-4 w-4 ${isPreferred ? "text-primary" : "text-muted-foreground"}`
  switch (type) {
    case "Celular":
    case "Telefone Residencial":
    case "Telefone Comercial":
      return <Phone className={iconClass} />
    case "Email":
      return <Mail className={iconClass} />
    default:
      return <Phone className={iconClass} />
  }
}

const formatContactValue = (type: IContact["contactItems"][number]["type"], value: string) => {
  if (type === "Celular" || type === "Telefone Residencial" || type === "Telefone Comercial") {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return value
}

export default function ContactCard({
  contact,
  accountId
}: ContactCardProps) {
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const { closeModal, open, openModal } = useUpdateContactModal()
  const queryClient = useQueryClient()

  const deleteContact = async (id: string) => {
    try {
      await deleteOneContact({ id })
      setOpenModalDelete(false)
      toast({
        title: "Sucesso",
        description: "Contato deletado com sucesso",
        variant: "success",
      })
    } catch (err) {
      console.log(err)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar contato",
        variant: "error",
      })
    }
  }

  return (
    <>
      <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src="/placeholder.svg" alt={`Foto de ${contact.name}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {contact.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
              {contact.positionOrRelation && (
                <p className="text-sm text-muted-foreground truncate">{contact.positionOrRelation}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => openModal()}
                aria-label="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setOpenModalDelete(true)}
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {contact.contactFor.map((forItem, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {forItem}
              </Badge>
            ))}
          </div>

          <div className="space-y-1">
            {contact.contactItems.map((item) => {
              const isPreferred = 
                (item.type === "Celular" && item.preferredContact.whatsapp) ||
                ((item.type === "Celular" || item.type.includes("Telefone")) && item.preferredContact.phone) ||
                (item.type === "Email" && item.preferredContact.email)

              return (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    {getContactIcon(item.type, item.preferredContact)}
                    {isPreferred && <Star className="h-3 w-3 text-primary fill-current" />}
                  </div>
                  <span className={isPreferred ? "font-medium text-foreground" : "text-muted-foreground"}>
                    {formatContactValue(item.type, item.contact)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <Dialog
        open={openModalDelete}
        setOpen={setOpenModalDelete}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Excluir contato</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tem certeza que deseja excluir esse contato?
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpenModalDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={() => deleteContact(contact.id)}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Dialog>

      <UpdateContactModal
        contact={contact}
        open={open}
        closeModal={closeModal}
      />
    </>
  )
}
