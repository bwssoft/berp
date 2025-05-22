"use client";

import { WhatsappIcon } from "../../../../svg/whatsapp-icon";
import {
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { findOneAccount } from "@/app/lib/@backend/action";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Button } from "@react-email/components";

interface ContactCardProps {
  accountId: string;
}

export function ContactCard({ accountId }: ContactCardProps) {
  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["findOneAccount", accountId],
    queryFn: async () => await findOneAccount({ id: accountId }),
    enabled: !!accountId,
  });

  if (accountLoading) {
    return <div>Carregando contatos...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-fit ">
      {accountData?.contacts?.map((contact) => (
        <div
          key={contact.id}
          className="shadow-md rounded-lg bg-slate-50 p-4 border border-gray-200 text-sm"
        >
          <div className="flex flex-row items-end justify-end w-full gap-1">
            <Button className="cursor-pointer" onClick={() => {}}>
              <TrashIcon className="w-5 h-5 cursor-pointer" />
            </Button>
            <Button className="cursor-pointer">
              <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
            </Button>
          </div>
          <div className="flex justify-between items-start flex-col w-full -mt-4">
            <span className="font-semibold text-[16px] text-gray-900">
              {contact.name}
            </span>
            <div className="text-xs">
              {contact.contactItems.map((contactItem) => (
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">{contactItem.type}: </span>
                  <span
                    title="Preferência de contato"
                    className="text-slate-700"
                  >
                    {contactItem.contact}
                  </span>
                  {contactItem.preferredContact.whatsapp == true && (
                    <WhatsappIcon />
                  )}
                  {contactItem.preferredContact.phone == true && <PhoneIcon />}
                  {contactItem.preferredContact.email == true && (
                    <EnvelopeIcon />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs">
              <span className="font-semibold">Área: </span>
              <span key={contact.positionOrRelation} className="text-slate-700">
                {contact.positionOrRelation}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-semibold">Contato para: </span>
              {contact.contactFor.map((contactFor) => (
                <span
                  key={contactFor}
                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-slate-700"
                >
                  {contactFor}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
