"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import { IContact } from "@/app/lib/@backend/domain";
import { Button } from "../../../component";
import { useQuery } from "@tanstack/react-query";
import { findOneAccount, findOneContact } from "@/app/lib/@backend/action";

interface ContactCardProps {
  accountId: string;
}

export function ContactCard({ accountId }: ContactCardProps) {
  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["findOneAccount", accountId],
    queryFn: async () => await findOneAccount({ id: accountId }),
    enabled: !!accountId,
  });

  const contactIds = accountData?.contacts?.map((c) => c) ?? [];

  const { data: contacts = [], isLoading: contactLoading } = useQuery({
    queryKey: ["findAllContacts", contactIds],
    queryFn: async () => {
      if (contactIds.length === 0) return [];
      const results = await Promise.all(
        contactIds.map((id) => findOneContact({ id }).catch(() => null))
      );
      return results.filter((c): c is IContact => !!c);
    },
    enabled: contactIds.length > 0,
  });

  if (accountLoading || contactLoading) {
    return <div>Carregando contatos...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-fit">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="shadow-md rounded-lg bg-white p-4 border border-gray-200 text-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-900">
                {contact.name}
              </span>
              <span className="text-gray-700">
                {contact.positionOrRelation}
              </span>
              {contact.department && (
                <span className="text-gray-500 text-xs">
                  {contact.department}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              className="p-1"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${contact.name} - ${contact.positionOrRelation} - ${contact.department ?? ""}`
                );
              }}
              title="Copiar dados"
            >
              <ClipboardIcon className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
