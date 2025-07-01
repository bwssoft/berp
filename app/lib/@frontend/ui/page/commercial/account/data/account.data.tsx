"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
} from "@/app/lib/@frontend/ui/component";

import {
  AlertCircle,
  CheckCircle,
  Phone,
  MapPin,
  XCircle,
  Plus,
} from "lucide-react";
import ContactCard from "@/app/lib/@frontend/ui/card/commercial/account/contact.card";
import { AccountCard } from "@/app/lib/@frontend/ui/card/commercial/account/account.card";
import { EconomicGroupCard } from "@/app/lib/@frontend/ui/card/commercial/account/economic-group.card";
import { AddressCard } from "@/app/lib/@frontend/ui/card/commercial/account/address.card";
import { IAccount, IAddress, IContact } from "@/app/lib/@backend/domain";
import { CreateAddressModal } from "@/app/commercial/account/form/create/tab/address/create-address";
import { CreateContactModal, UpdateContactModal, useCreateContactModal, useUpdateContactModal } from "../../../../modal";
import { useState } from "react";
import { deleteOneContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { toast } from "@/app/lib/@frontend/hook";

interface Props {
  account: IAccount;
  address: IAddress[];
  permissions: {
    hasPermissionContacts: boolean;
    hasPermissionAddresses: boolean;
    hasPermissionEconomicGroup: boolean;
  };
}
export function AccountDataPage(props: Props) {
  const {
    account,
    address,
    permissions: {
      hasPermissionContacts,
      hasPermissionAddresses,
      hasPermissionEconomicGroup,
    },
  } = props;
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact>();
  const isCompany = account.document.type === "cnpj";

  const deleteContact = async (id: string) => {
    try {
      await deleteOneContact({ id });
      setOpenModalDelete(false);
      toast({
        title: "Sucesso",
        description: "Contato deletado com sucesso",
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar contato",
        variant: "error",
      });
    }
  };
  
  /**
   * MODAL ATUALIZAÇÃO - GRUPO ECONOMICO
  */

  const modalEconomicGroup = {};

  /**
   * MODAL CRIAÇÃO - CONTATO
  */
 
 const {
   open: openCreateContact,
   openModal: openModalContact,
   closeModal: closeModalContact,
  } = useCreateContactModal();

  /**
   * MODAL ATUALIZAÇÃO - CONTATO
  */
  const { 
    closeModal, 
    open: openUpdateContact, 
    openModal: openUpdateModalContact, 
    closeModal: closeUpdateModalContact 
  } = useUpdateContactModal();       

  /**
   * MODAL CRIAÇÃO - ADDRESS
   */

  const modalCreateAddress = {};

  /**
   * MODAL ATUALIZAÇÃO - ADDRESS
   */

  const modalUpdateAddress = {};

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      {/* Seção Principal - Dados da Empresa + Grupo Econômico lado a lado com mesma altura */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <AccountCard account={account} />

        {/* Card de Grupo Econômico - Lado Direito - Apenas para empresas */}
        {isCompany &&
          (account.economic_group_holding ||
            account.economic_group_controlled) && (
            <EconomicGroupCard
              account={account}
              hasPermissionEconomicGroup={hasPermissionEconomicGroup}
            />
          )}
      </div>

      {/* Segunda linha - Contatos e Endereços com mesma altura */}
      <div className="grid grid-cols-1 gap-6 items-stretch">
        {/* Card de Contatos */}
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contatos
                <Badge variant="secondary" className="text-xs">
                  {account.contacts?.length}
                </Badge>
              </CardTitle>
              {hasPermissionContacts && (
                <Button
                  variant={"ghost"}
                  className="border px-3 py-3"
                  onClick={openModalContact}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              <CreateContactModal open={openCreateContact} closeModal={closeModalContact} />
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            {(account.contacts ?? [])?.map((contact, idx) => (
              <ContactCard
                key={contact.id ?? idx}
                contact={contact}
                accountId={account.id!}
                onClickEditContactButton={() => {setSelectedContact(contact), openUpdateModalContact()}}
                onClickDeleteButton={() => {setOpenModalDelete(true), setSelectedContact(contact)}}
              />
            ))}
            
            {/* Modal para confirmar exclusao de contato */}
            <Dialog open={openModalDelete} setOpen={setOpenModalDelete}>
              <div className="p-4">
                <h2 className="text-lg font-semibold">Excluir contato</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Tem certeza que deseja excluir esse contato?
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setOpenModalDelete(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="default" onClick={() => selectedContact && deleteContact(selectedContact.id)}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </Dialog>

            {/* modal de atualização de contato */}
            <UpdateContactModal
              contact={selectedContact!}
              open={openUpdateContact}
              closeModal={closeUpdateModalContact}
            />
          </CardContent>
        </Card>

        {/* Card de Endereço */}
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereços
                {address?.length && (
                  <Badge variant="secondary" className="text-xs">
                    {address.length}
                  </Badge>
                )}
              </CardTitle>
              {hasPermissionAddresses && (
                <CreateAddressModal id={account.id!} />
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="lg:col-span-2 h-full"></div>
            <div className="lg:col-span-2 h-full space-y-3">
              {address.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {address.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      title="Endereço:"
                      address={addr}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhum endereço encontrado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Cadastre um endereço para este cliente.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  type?: "billing" | "situation" | "general";
}

export function StatusBadge({ status, type = "general" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "billing") {
      return status === "Ativo"
        ? {
            variant: "default" as const,
            icon: CheckCircle,
            className: "bg-green-100 text-green-800 border-green-200",
          }
        : {
            variant: "secondary" as const,
            icon: XCircle,
            className: "bg-red-100 text-red-800 border-red-200",
          };
    }

    if (type === "situation") {
      switch (status) {
        case "Adimplente":
          return {
            variant: "default" as const,
            icon: CheckCircle,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "Inadimplente":
          return {
            variant: "destructive" as const,
            icon: AlertCircle,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "Inadimplente/Bloqueado":
          return {
            variant: "destructive" as const,
            icon: XCircle,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return {
            variant: "secondary" as const,
            icon: AlertCircle,
            className: "",
          };
      }
    }

    return {
      variant: "outline" as const,
      icon: CheckCircle,
      className: "",
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}
