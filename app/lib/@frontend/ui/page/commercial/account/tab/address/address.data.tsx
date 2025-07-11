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
import { IAccount, IAddress, IContact } from "@/app/lib/@backend/domain";

import { useState } from "react";
import { useAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address/use-address.modal";
import { useAddressUpdateModal } from "@/app/lib/@frontend/ui/modal/comercial/address/update/use-address.update.modal";
import { useAddressDeleteDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/address/delete/use-delete.address";
import { AddressUpdateModal } from "@/app/lib/@frontend/ui/modal/comercial/address/update";
import { CreatedAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address";
import { AddressDeleteDialog } from "@/app/lib/@frontend/ui/dialog/commercial/account/address/delete/delete.address";

interface Props {
  account: IAccount;
  address: IAddress[];
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

  const [selectedAddress, setSelectedAddress] = useState<IAddress>();
  const {
    open: openModalAddress,
    closeModal: closeCreateModalAddress,
    openModal: openCreateModalAddress,
  } = useAddressModal();

  /**
   * MODAL ATUALIZAÇÃO - ADDRESS
   */

  const {
    open: openUpdateAddress,
    closeModal: closeUpdateModalAddress,
    openModal: openUpdateModalAddress,
  } = useAddressUpdateModal();

  /**
   * MODAL Exclusão - ADDRESS
   */
  const {
    open: openModalDelete,
    setOpen: setOpenModalDelete,
    confirm: deleteAddress,
    isLoading,
  } = useAddressDeleteDialog();
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <div className="grid grid-cols-1 gap-6 items-stretch">
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereços
                <Badge variant="secondary" className="text-xs">
                  {address.length}
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

      <AddressUpdateModal
        address={selectedAddress!}
        closeUpdateModal={closeUpdateModalAddress}
        openUpdateModal={openUpdateAddress}
      />

      <AddressUpdateModal
        address={selectedAddress!}
        closeUpdateModal={closeUpdateModalAddress}
        openUpdateModal={openUpdateAddress}
      />

      <CreatedAddressModal
        accountId={account.id!}
        closeModal={closeCreateModalAddress}
        open={openModalAddress}
      />

      <AddressDeleteDialog
        address={selectedAddress}
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onDelete={(id) => deleteAddress(id)}
        isLoading={isLoading}
      />
    </div>
  );
}
