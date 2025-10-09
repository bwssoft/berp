import { usePathname } from "next/navigation";
import {IAddress} from "@/backend/domain/commercial/entity/address.definition";
import {IContact} from "@/backend/domain/commercial/entity/contact.definition";
import {
  LocalAddress,
  LocalContact,
} from "@/app/lib/@frontend/context/create-account-flow.context";

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
    href: `/commercial/account/form/create/tab/address?accountId=${accountId}`,
  },
  {
    id: "contact",
    title: "CONTATOS",
    href: `/commercial/account/form/create/tab/contact?accountId=${accountId}`,
  },
];

export function useAccountStepProgress({
  accountId,
  addresses,
  contacts,
}: {
  accountId: string;
  addresses: IAddress[] | LocalAddress[];
  contacts: IContact[] | LocalContact[];
}) {
  const pathname = usePathname();

  const steps = rawSteps(accountId);

  // Improved pathname matching logic
  const getCurrentStepIndex = () => {
    if (pathname.includes("/tab/address")) return 1; // address step
    if (pathname.includes("/tab/contact")) return 2; // contact step
    if (pathname.includes("/form/create") && !pathname.includes("/tab/"))
      return 0; // create step
    return -1; // no match
  };

  const currentIndex = getCurrentStepIndex();

  return steps.map((step, index) => ({
    ...step,
    // Add isActive property based on current index
    isActive: index === currentIndex,
    // Navigation rules based on flow context
    href:
      step.id === "address" && !accountId
        ? "#"
        : step.id === "contact" && (!accountId || addresses.length === 0)
          ? "#"
          : step.href,
    disabled:
      (step.id === "address" && !accountId) ||
      (step.id === "contact" && (!accountId || addresses.length === 0)),
    completed:
      index < currentIndex ||
      step.id === "create" ||
      (step.id === "address" && addresses.length > 0) ||
      (step.id === "contact" && contacts.length > 0),
  }));
}

