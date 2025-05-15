"use client";
import { findManyContact } from "@/app/lib/@backend/action";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useSearchContactAccount(accountId: string) {
  const [accounts, setAccounts] = useState<any[]>([
    {
      companyName: "Vasconcelos Alves Atacado ME",
      contacts: [
        { id: "1", name: "Monique Bastida Temperini" },
        { id: "2", name: "Viviane Campos Negris" },
        { id: "3", name: "Tomás Pacheco Fonseca" },
      ],
    },
    {
      companyName: "Costa Cosme Propaganda EPP",
      contacts: [
        { id: "4", name: "Outro Contato 1" },
        { id: "5", name: "Outro Contato 2" },
      ],
    },
    {
      companyName: "Francoso Marins Planejamento ME",
      contacts: [],
    },
  ]);

  const contacts = useQuery({
    queryKey: ["findManyContacts"],
    queryFn: async () => {
      const data = await findManyContact();
      return data;
    },
  });

  return { accounts, contacts };
}
