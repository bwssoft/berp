"use client";

import { updateOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { createOneHistorical } from "@/app/lib/@backend/action/commercial/historical.action";
import { IAddress } from "@/app/lib/@backend/domain";
import { LocalAddress } from "@/app/lib/@frontend/context/create-account-flow.context";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context";
import { useAuth } from "@/app/lib/@frontend/context";
import { useSearchParams } from "next/navigation";
import { getChangedFields } from "@/app/lib/util/get-changed-fields";

export function useAddressUpdateModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const { updateAddressLocally: updateAddressInContext } =
    useCreateAccountFlow();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function updateAddress(
    addressId: string,
    newData: IAddress,
    originalAddress?: IAddress
  ) {
    try {
      const editedFields = getChangedFields(originalAddress, newData);

      await updateOneAddress({ id: addressId }, newData);

      const targetAccountId = accountId || newData.accountId;

      if (targetAccountId) {
        try {
          const addressType = newData.type?.join?.(", ") || "comercial";
          await createOneHistorical({
            accountId: targetAccountId,
            title: `Endereço ${addressType} atualizado.`,
            editedFields: editedFields,
            type: "manual",
            author: {
              name: user?.name ?? "",
              avatarUrl: "",
            },
          });
        } catch (error) {
          console.warn(
            "Failed to create address update historical entry:",
            error
          );
        }
      } else {
        console.warn(
          "Address update - No accountId available for historical tracking"
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["findOneAccount", targetAccountId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["findManyAccount"],
      });

      toast({
        title: "Sucesso!",
        description: "Endereço atualizado com sucesso!",
        variant: "success",
      });

      closeModal();
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o endereço!",
        variant: "error",
      });
    }
  }

  async function updateAddressLocally(
    addressId: string,
    data: Partial<LocalAddress>
  ) {
    updateAddressInContext(addressId, data);

    closeModal();
  }

  return {
    open,
    openModal,
    closeModal,
    updateAddress,
    updateAddressLocally,
  };
}
