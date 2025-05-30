"use client";

import { findOneAccount } from "@/app/lib/@backend/action";
import { IAddress } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component";
import { useRouter } from "next/navigation";

interface Props {
    id: string;
    addresses: boolean;
    accounts: boolean;
}

export async function PageFooterButtons({ id, addresses, accounts }: Props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    return (
        <div className="flex gap-4 items-end justify-end mt-4">
            <Button type="button" variant="ghost">
                Cancelar
            </Button>
            {accounts && addresses && (
                <Button
                    type="submit"
                    onClick={() =>
                        router.push(
                            `/commercial/account/form/create/tab/contact?id=${id}`
                        )
                    }
                >
                    Salvar e próximo
                </Button>
            )}
        </div>
    );
}
