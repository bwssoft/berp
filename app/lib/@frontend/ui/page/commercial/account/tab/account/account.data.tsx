"use client";

import { useAccountStepProgress } from "@/app/lib/@frontend/ui/card/commercial/tab/use-account-step-progress";
import StepNavigation from "@/app/lib/@frontend/ui/card/commercial/tab/account-tab";
import { IAddress, IContact } from "@/app/lib/@backend/domain";

interface Props {
    accountId: string;
    addresses: IAddress[];
    contacts: IContact[];
}

export function AccountData({ accountId, addresses, contacts }: Props) {
    const steps = useAccountStepProgress({
        accountId,
        addresses,
        contacts,
    });

    return <StepNavigation steps={steps} />;
}
