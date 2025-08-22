"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component";

import { MapPin, Plus } from "lucide-react";
import { AddressCard } from "@/app/lib/@frontend/ui/card/commercial/account/address.card";
import {
  LocalAccount,
  LocalAddress,
  useCreateAccountFlow,
} from "@/app/lib/@frontend/context/create-account-flow.context";

import { useState } from "react";
import { useAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address/use-address.modal";
import { useAddressUpdateModal } from "@/app/lib/@frontend/ui/modal/comercial/address/update/use-address.update.modal";
import { useAddressDeleteDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/address/delete/use-delete.address";
import { AddressUpdateModal } from "@/app/lib/@frontend/ui/modal/comercial/address/update";
import { CreateAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address";
import { AddressDeleteDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/address/delete/delete.address";
import StepNavigation from "@/app/lib/@frontend/ui/card/commercial/tab/account-tab";
import { useAccountStepProgress } from "@/app/lib/@frontend/ui/card/commercial/tab/use-account-step-progress";

interface Props {
  account: LocalAccount;
  address: LocalAddress[];
  permissions: {
    hasPermissionContacts: boolean;
    hasPermissionAddresses: boolean;
    hasPermissionEconomicGroup: boolean;
  };
}

export function AddressDataPage(props: Props) {
  const {
    account,
    address,
    permissions: { hasPermissionAddresses },
  } = props;

  // Use create account flow context
  const {
    account: localAccount,
    addresses: localAddresses,
    contacts: localContacts,
  } = useCreateAccountFlow();

  // Props are already the local data, so use them directly
  const currentAccount = localAccount;
  const currentAddresses = localAddresses;

  // Generate steps using the hook
  const steps = useAccountStepProgress({
    accountId: currentAccount?.id || "",
    addresses: currentAddresses,
    contacts: localContacts,
  });

  const [selectedAddress, setSelectedAddress] = useState<LocalAddress>();
  const [copiedAddress, setCopiedAddress] = useState<LocalAddress>();

  const {
    open: openModalAddress,
    closeModal: closeCreateModalAddress,
    openModal: openCreateModalAddress,
    createAddressLocally: createAddress,
  } = useAddressModal();

  const {
    open: openUpdateAddress,
    closeModal: closeUpdateModalAddress,
    openModal: openUpdateModalAddress,
    updateAddressLocally,
  } = useAddressUpdateModal();

  // Reset copied address when closing create modal
  const handleCloseCreateModal = () => {
    setCopiedAddress(undefined);
    closeCreateModalAddress();
  };

  // Reset copied address after successful form submission
  const handleCreateAddress = async (data: any) => {
    await createAddress(data);
    setCopiedAddress(undefined);
  };

  /**
   * MODAL Exclusão - ADDRESS
   */
  const {
    open: openModalDelete,
    setOpen: setOpenModalDelete,
    deleteAddressLocally: deleteAddress,
    isLoading,
  } = useAddressDeleteDialog();

  return (
    <>
      {/* Step Navigation */}
      <div className="mb-6">
        <StepNavigation steps={steps} />
      </div>

      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 gap-6 items-stretch">
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
                {currentAddresses.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {currentAddresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        title="Endereço:"
                        address={addr}
                        onEdit={() => {
                          setSelectedAddress(addr);
                          openUpdateModalAddress();
                        }}
                        onDelete={() => {
                          setSelectedAddress(addr);
                          setOpenModalDelete(true);
                        }}
                        onCopy={() => {
                          setCopiedAddress(addr);
                          openCreateModalAddress();
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
      </div>
      <AddressUpdateModal
        address={selectedAddress!}
        closeUpdateModal={closeUpdateModalAddress}
        openUpdateModal={openUpdateAddress}
        updateAddress={updateAddressLocally}
      />

      <CreateAddressModal
        accountId={currentAccount?.id || ""}
        closeModal={handleCloseCreateModal}
        open={openModalAddress}
        createAddress={handleCreateAddress}
        defaultValues={{
          zip_code: copiedAddress?.zip_code ?? "",
          street: copiedAddress?.street ?? "",
          number: copiedAddress?.number ?? "",
          complement: copiedAddress?.complement ?? "",
          district: copiedAddress?.district ?? "",
          city: copiedAddress?.city ?? "",
          state: copiedAddress?.state ?? "",
          reference_point: copiedAddress?.reference_point ?? "",
          type: [],
          default_address: false,
        }}
      />

      <AddressDeleteDialog
        address={selectedAddress}
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onDelete={(id) => deleteAddress(selectedAddress?.id || "")}
        isLoading={isLoading}
      />

      <AddressDeleteDialog
        address={selectedAddress}
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onDelete={(id) => deleteAddress(id)}
        isLoading={isLoading}
      />
    </>
  );
}
