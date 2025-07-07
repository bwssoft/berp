"use client";

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

    return (
        <div className="flex gap-4 items-end justify-end mt-4">
            <Button type="button" variant="ghost">
                Cancelar
            </Button>
            {accounts && addresses && (
                <FakeLoadingButton
                    controlledLoading={false}
                    type="submit"
                    onClick={async () => {
                        await new Promise((resolve) => setTimeout(resolve, 50));
                        router.push(
                            `/commercial/account/form/create/tab/contact?id=${id}`
                        );
                    }}
                >
                    Salvar e próximo
                </FakeLoadingButton>
            )}
        </div>
    );
}
