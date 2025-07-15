"use client";

import { IContact } from "@/app/lib/@backend/domain";
import { Phone, Mail, Edit, Star, Trash, Copy } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
} from "../../../component";
import { Separator } from "@radix-ui/react-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../component/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { cn } from "@/app/lib/util/cn";
import { copyToClipboard } from "@/app/lib/util/copyToClipboard";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { fetchCnpjData } from "@/app/lib/@backend/action/cnpja/cnpja.action";
import { updateOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

interface ContactCardProps {
  contact: IContact;
  accountId: string;
  classname?: string;
  onClickEditContactButton: () => void
  onClickDeleteButton: () => void
  onCopy: () => void
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
  classname,
  onClickEditContactButton, 
  onClickDeleteButton,
  onCopy
}: ContactCardProps) {

  const handleCopy = () => {
    const contactInfo = `${contact.name}\n` +
      contact.contactItems.map(item => {
        return `${item.type}: ${item.contact}`;
      }).join("\n");

    if (onCopy) {
      onCopy();
    } else {
      copyToClipboard(contactInfo);
    }
  };

  const handleReloadContactFromApi = async () => {
    const data = await fetchCnpjData(contact.taxId!);

    const newNumber = `${data?.phones[0].area}${data?.phones[0].number}`.replace(/\D/g, "");
    const currentNumber = contact.contactItems[0].contact.replace(/\D/g, "");

    if (newNumber !== currentNumber) {
      const contactCnpj = await updateOneContact(
        { id: contact.id },
        {
          accountId: accountId,
          name: data?.company.name || data?.alias || "",
          contractEnabled: false,
          positionOrRelation: "",
          originType: "api",
          taxId: data?.taxId,
          contactFor: ["Fiscal"],
          contactItems: [
            {
              id: crypto.randomUUID(),
              contact: `${data?.phones[0].area}${data?.phones[0].number}`,
              type: data?.phones[0].type === "LANDLINE"
                ? "Telefone Comercial"
                : "Celular",
              preferredContact: {},
            },
          ],
        }
      );

      if (contactCnpj.success) {
        toast({
          title: "Contato atualizado",
          description: "Os dados foram sincronizados com sucesso.",
          variant: "success"
        });
      } else if (contactCnpj.error) {
        toast({
          title: "Erro",
          description: contactCnpj.error.global || "Não foi possível atualizar o contato.",
          variant: "error",
        });
      }
    } else {
      toast({
        title: "Nenhuma atualização necessária",
        description: "O contato já está sincronizado com a API.",
      });
    }
  };

  return (
    <>
      <Card className={cn("w-full max-w-sm flex mx-0 gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors", classname)}>
        <Avatar className="h-12 w-12 border">
          <AvatarImage src="/placeholder.svg" alt={`Foto de ${contact.name}`} />
          <AvatarFallback title={contact.name} className="bg-primary/10 text-primary font-semibold">
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
              <h3 title={contact.name} className="font-semibold text-foreground truncate">
                {contact.name}
              </h3>
              {contact.positionOrRelation && (
                <p className="text-sm text-muted-foreground truncate">
                  {contact.positionOrRelation}
                </p>
              )}
            </div>

            <div className=" flex gap-2">
              <TooltipProvider>
              {contact.originType !== "api" && (
                <>
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
                </>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={handleCopy}
                      aria-label="Editar Contato"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Copiar contato</p>
                  </TooltipContent>
                </Tooltip>
              {contact.originType == "api" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={handleReloadContactFromApi}
                        aria-label="Editar Contato"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Atualizar contato</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
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
      </Card>

      <Separator className="my-4" />
    </>
  );
}
