import { usePathname } from "next/navigation";
import { IAddress, IContact } from "@/app/lib/@backend/domain";

interface Step {
    id: string;
    title: string;
    href: string;
}

const rawSteps = (accountId: string): Step[] => [
    {
        id: "create",
        title: "CONTA",
        href: `/commercial/account/form/create?id=${accountId}`,
    },
    {
        id: "address",
        title: "ENDEREÇOS",
        href: `/commercial/account/form/create/tab/address?id=${accountId}`,
    },
    {
        id: "contact",
        title: "CONTATOS",
        href: `/commercial/account/form/create/tab/contact?id=${accountId}`,
    },
];

export function useAccountStepProgress({
    accountId,
    addresses,
    contacts,
}: {
    accountId: string;
    addresses: IAddress[];
    contacts: IContact[];
}) {
    const pathname = usePathname();

    const steps = rawSteps(accountId);
    const currentIndex = steps.findIndex((step) => pathname.includes(step.id));

    return steps.map((step, index) => ({
        ...step,
        completed:
            index < currentIndex ||
            step.id === "create" ||
            (step.id === "address" && addresses.length > 0) ||
            (step.id === "contact" && contacts.length > 0),
    }));
}
