"use client";

import { deleteManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { deleteManyContact } from "@/app/lib/@backend/action/commercial/contact.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Button } from "@/app/lib/@frontend/ui/component";
import { FakeLoadingButton } from "@/app/lib/@frontend/ui/component/fake-load-button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  addresses: boolean;
  accounts: boolean;
}

export function PageFooterButtons({ id, addresses, accounts }: Props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  async function handleCancel() {
    try {
      await deleteManyAddress({ accountId: id });
      await deleteManyContact({ accountId: id });

      toast({
        title: "Cancelado!",
        description: "Todos os endereços e contatos da conta foram removidos.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting addresses and contacts:", error);
      toast({
        title: "Erro!",
        description: "Erro ao cancelar e remover endereços e contatos.",
        variant: "error",
      });
    }
  }

  return (
    <div className="flex gap-4 items-end justify-end mt-4">
      <Button onClick={handleCancel} type="button" variant="ghost">
        Cancelar
      </Button>
      {accounts && addresses && (
        <FakeLoadingButton
          controlledLoading={false}
          type="submit"
          onClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            router.push(`/commercial/account/form/create/tab/contact?id=${id}`);
          }}
        >
          Salvar e próximo
        </FakeLoadingButton>
      )}
    </div>
  );
}
