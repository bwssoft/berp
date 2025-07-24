"use client";

import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { Button } from "@/app/lib/@frontend/ui/component";
import { FakeLoadingButton } from "@/app/lib/@frontend/ui/component/fake-load-button";
import { useRouter } from "next/navigation";
import { useCreateAccountFlow } from "@/app/lib/@frontend/context/create-account-flow.context";

interface Props {
  id: string;
  addresses: boolean;
  accounts: boolean;
}

export function PageFooterButtons({ id, addresses, accounts }: Props) {
  const router = useRouter();
  const { resetFlow } = useCreateAccountFlow();

  async function handleCancel() {
    try {
      resetFlow();

      toast({
        title: "Cancelado!",
        description: "O fluxo de criação foi cancelado.",
        variant: "success",
      });

      router.push("/commercial");
    } catch (error) {
      console.error("Error canceling flow:", error);
      toast({
        title: "Erro!",
        description: "Erro ao cancelar operação.",
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
            router.push(
              `/commercial/account/form/create/tab/contact?accountId=${id}`
            );
          }}
        >
          Salvar e próximo
        </FakeLoadingButton>
      )}
    </div>
  );
}
