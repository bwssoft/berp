"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  CreateContactModal,
  UpdateContactModal,
  UpdateEconomicGroupAccountModal,
  useCreateContactModal,
  useUpdateContactModal,
} from "../../../../modal";
import { useState } from "react";
import { useAddressUpdateModal } from "../../../../modal/comercial/address/update/use-address.update.modal";
import { useAddressModal } from "../../../../modal/comercial/address/use-address.modal";
import { AddressUpdateModal } from "../../../../modal/comercial/address/update";
import { CreateAddressModal } from "../../../../modal/comercial/address";
import { AddressDeleteDialog } from "../../../../dialog/commercial/account/address/delete/delete.address";
import { useAddressDeleteDialog } from "../../../../dialog/commercial/account/address/delete/use-delete.address";
import { DeleteContactDialog } from "../../../../dialog/commercial/account/contact/delete/delete.contact.dialog";
import { useDeleteContactDialog } from "../../../../dialog/commercial/account/contact/delete/use-delete.contact.dialog";
import { useEconomicGroupUpdateModal } from "../../../../modal/comercial/economic-group/update/use-economic-group.update.modal";
import { useAccountDataUpdateModal } from "../../../../modal/comercial/account/update/use-account-data.update.modal";
import { AccountDataUpdateModal } from "../../../../modal/comercial/account/update/account-data.update.modal";
import { refreshOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import StepNavigation from "../../../../card/commercial/tab/account-tab";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";
import { useAccountStepProgress } from "../../../../card/commercial/tab/use-account-step-progress";

interface Props {
  account: IAccount;
  address: IAddress[];
  contacts: IContact[];

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
    contacts,
    permissions: {
      hasPermissionContacts,
      hasPermissionAddresses,
      hasPermissionEconomicGroup,
    },
  } = props;

  // Use create account flow context if we're in flow mode
  const {
    account: localAccount,
    addresses: localAddresses,
    contacts: localContacts,
  } = useCreateAccountFlow();

  // Props are already the local data when available, otherwise use props data
  const currentAccount = localAccount || account;
  const currentAddresses = localAddresses || address;
  const currentContacts = localContacts || contacts;

  // Generate steps using the hook
  const steps = useAccountStepProgress({
    accountId: currentAccount?.id || "",
    addresses: currentAddresses,
    contacts: currentContacts,
  });

  const [selectedContact, setSelectedContact] = useState<IContact | any>();
  const [selectedAddress, setSelectedAddress] = useState<IAddress | any>();
  const isCompany = currentAccount.document.type === "cnpj";

  /**
   * MODAL ATUALIZAÇÃO - GRUPO ECONOMICO
   */

  const {
    open: updateEconomicGroup,
    closeModal: closeUpdateEconomicGroup,
    openModal: openUpdateEconomicGroup,
  } = useEconomicGroupUpdateModal();

  /**
   * MODAL CRIAÇÃO - CONTATO
   */

  const {
    open: openCreateContact,
    openModal: openModalContact,
    closeModal: closeModalContact,
    createContact,
  } = useCreateContactModal();

  /**
   * MODAL ATUALIZAÇÃO - CONTATO
   */
  const {
    open: openUpdateContact,
    openModal: openUpdateModalContact,
    closeModal: closeUpdateModalContact,
    updateContact,
  } = useUpdateContactModal();

  /**
   * MODAL DELEÇÃO - CONTATO
   */
  const {
    open: openDeleteContact,
    openDialog: openDeleteContactModal,
    setOpen: setOpenDeleteContactModal,
    isLoading: isLoadingDeleteContact,
    deleteContact,
  } = useDeleteContactDialog();

  /**
   * MODAL CRIAÇÃO - ADDRESS
   */

  const {
    open: openModalAddress,
    closeModal: closeCreateModalAddress,
    openModal: openCreateModalAddress,
    createAddress,
  } = useAddressModal();

  /**
   * MODAL ATUALIZAÇÃO - ADDRESS
   */

  const {
    open: openUpdateAddress,
    closeModal: closeUpdateModalAddress,
    openModal: openUpdateModalAddress,
    updateAddress,
  } = useAddressUpdateModal();

  const {
    open: openModalDelete,
    setOpen: setOpenModalDelete,
    isLoading: isLoadingAddressDelete,
    deleteAddress,
  } = useAddressDeleteDialog();

  /**
   * MODAL ATUALIZAÇÃO - DADOS DA CONTA
   */
  const {
    openModal: openUpdateModalAccountData,
    open: openUpdateAccountData,
    closeModal: closeUpdateAccountData,
  } = useAccountDataUpdateModal();

  /**
   * ATUALIZAÇÃO - DADOS DA CONTA
   */
  const onRefreshAccountData = async () => {
    await refreshOneAccount(account.document.value);
    toast({
      variant: "success",
      description: "Conta atualizada com sucesso!",
      title: "Sucesso",
    });
  };
  const [addressToClone, setAddressToClone] = useState<Partial<IAddress>>();

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      {/* Step Navigation - only show in flow mode */}
      {localAccount && (
        <div className="mb-6">
          <StepNavigation steps={steps} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <AccountCard
          account={account}
          onClickButtonEdit={() => {
            openUpdateModalAccountData();
          }}
          onRefresh={onRefreshAccountData}
        />

        {isCompany && (
          <EconomicGroupCard
            openModal={openUpdateEconomicGroup}
            account={currentAccount}
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
                  {currentContacts?.length || 0}
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
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="lg:col-span-2 h-full">
              {currentContacts && currentContacts.length > 0 ? (
                <div className="flex flex-wrap gap-x-1.5 gap-y-3">
                  {currentContacts.map((contact, idx) => (
                    <ContactCard
                      key={contact.id ?? idx}
                      contact={contact}
                      accountId={currentAccount.id!}
                      onClickEditContactButton={() => {
                        setSelectedContact(contact);
                        openUpdateModalContact();
                      }}
                      onClickDeleteButton={() => {
                        setSelectedContact(contact);
                        openDeleteContactModal();
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhum contato encontrado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Cadastre um contato para este cliente.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereços
                <Badge variant="secondary" className="text-xs">
                  {currentAddresses.length}
                </Badge>
              </CardTitle>
              {hasPermissionAddresses && (
                <Button
                  variant={"ghost"}
                  className="border px-3 py-3"
                  onClick={openCreateModalAddress}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
                      onCopy={() => {
                        setAddressToClone(addr);
                        openCreateModalAddress();
                      }}
                      onEdit={() => {
                        setSelectedAddress(addr);
                        openUpdateModalAddress();
                      }}
                      onDelete={() => {
                        setSelectedAddress(addr);
                        setOpenModalDelete(true);
                      }}
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

      <CreateContactModal
        open={openCreateContact}
        closeModal={closeModalContact}
        createContact={createContact}
      />

      <UpdateContactModal
        contact={selectedContact!}
        open={openUpdateContact}
        closeModal={closeUpdateModalContact}
        updateContact={updateContact}
      />

      <AddressUpdateModal
        address={selectedAddress!}
        closeUpdateModal={closeUpdateModalAddress}
        openUpdateModal={openUpdateAddress}
        updateAddress={updateAddress}
      />

      <DeleteContactDialog
        open={openDeleteContact}
        setOpen={setOpenDeleteContactModal}
        confirm={() => selectedContact && deleteContact(selectedContact.id)}
        isLoading={isLoadingDeleteContact}
      />

      <CreateAddressModal
        accountId={currentAccount.id!}
        closeModal={closeCreateModalAddress}
        open={openModalAddress}
        createAddress={createAddress}
      />

      <AddressDeleteDialog
        address={selectedAddress}
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onDelete={(id) => deleteAddress(id)}
        isLoading={isLoadingAddressDelete}
      />

      <UpdateEconomicGroupAccountModal
        accountId={account.id!}
        onClose={closeUpdateEconomicGroup}
        open={updateEconomicGroup}
        economicGroupHolding={account.economic_group_holding}
        economicGroupControlled={account.economic_group_controlled}
      />

      <AccountDataUpdateModal
        openUpdateModal={openUpdateAccountData}
        closeUpdateModal={closeUpdateAccountData}
        accountData={account}
      />
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
