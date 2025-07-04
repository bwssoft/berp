"use client";

import { IContact } from "@/app/lib/@backend/domain";
import { Phone, Mail, Edit, Star, Trash } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
} from "../../../component";
import { Separator } from "@radix-ui/react-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../component/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface ContactCardProps {
  contact: IContact;
  accountId: string;
  onClickEditContactButton: () => void
  onClickDeleteButton: () => void
}

const getContactIcon = (
  type: IContact["contactItems"][number]["type"],
  preferred: IContact["contactItems"][number]["preferredContact"]
) => {
  const isPreferred =
    (type === "Celular" && preferred.whatsapp) ||
    ((type === "Celular" || type.includes("Telefone")) && preferred.phone) ||
    (type === "Email" && preferred.email);

  const iconClass = `h-4 w-4 ${isPreferred ? "text-primary" : "text-muted-foreground"}`;
  switch (type) {
    case "Celular":
    case "Telefone Residencial":
    case "Telefone Comercial":
      return <Phone className={iconClass} />;
    case "Email":
      return <Mail className={iconClass} />;
    default:
      return <Phone className={iconClass} />;
  }
};

const formatContactValue = (
  type: IContact["contactItems"][number]["type"],
  value: string,
) => {
  if (
    type === "Celular" ||
    type === "Telefone Residencial" ||
    type === "Telefone Comercial"
  ) {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return value;
};

export default function ContactCard({ 
  contact, 
  accountId, 
  onClickEditContactButton, 
  onClickDeleteButton 
}: ContactCardProps) {

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
              <h3 className="font-semibold text-foreground truncate">
                {contact.name}
              </h3>
              {contact.positionOrRelation && (
                <p className="text-sm text-muted-foreground truncate">
                  {contact.positionOrRelation}
                </p>
              )}
            </div>

            <div className="ml-auto flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={onClickEditContactButton}
                      aria-label="Editar Contato"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Editar contato</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={onClickDeleteButton}
                      aria-label="Excluir Contato"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Excluir contato</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                ((item.type === "Celular" || item.type.includes("Telefone")) &&
                  item.preferredContact.phone) ||
                (item.type === "Email" && item.preferredContact.email);

              return (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    {getContactIcon(item.type, item.preferredContact)}
                    {isPreferred && (
                      <Star className="h-3 w-3 text-primary fill-current" />
                    )}
                  </div>
                  <span
                    className={
                      isPreferred
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {formatContactValue(item.type, item.contact)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Separator className="my-4" />
    </>
  );
}
