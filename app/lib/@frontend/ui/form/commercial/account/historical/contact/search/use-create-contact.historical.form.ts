"use client";
import { useState, useEffect } from "react";
import { ContactSelection, IAccount, IContact } from "@/app/lib/@backend/domain";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  contacts?: {
    name: string;
    contacts: IContact[];
    documentValue: string;
  }[];
  accountData?: IAccount;
  selectContact: ContactSelection | undefined;
  setSelectContact: (
    value: ContactSelection | undefined | ((prev: ContactSelection | undefined) => ContactSelection | undefined)
  ) => void;
}

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.array(z.string(), {message: "Tipo é obrigatório"}).min(1, "Tipo é obrigatório"),
  contact: z.string().min(1, "Contato é obrigatório"),
});

export function useSearchContactHistoricalAccount({
  contacts,
  selectContact,
  setSelectContact,
}: Props) {
  const [contactData, setContactData] = useState<Props["contacts"]>([]);
  const [otherContactInfo, setOtherContactInfo] = useState({
    name: "",
    type: "",
    contact: "",
    channel: ""
  });

  const { 
    handleSubmit,
    formState: errors,
    control
  } = useForm<z.infer<typeof schema>>({
    resolver:  zodResolver(schema),
  })

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const onlyWithContacts = contacts.filter(
        (company) => company.contacts && company.contacts.length > 0
      );
      setContactData(onlyWithContacts);
    }
  }, [contacts]);


 const isSelected = (id: string, channel: string) =>
  selectContact?.id === id && selectContact?.channel === channel;


  const toggleSelection = (
    id: string,
    name: string,
    type: string,
    contact: string,
    channel: string,
  ) => {
    setSelectContact((prev) => {
      if (prev?.id === id && prev?.channel === channel) {
        return undefined;
      } else {
        return { id, name, type, contact, channel };
      }
    });
  };

  const handleAddOtherContact = handleSubmit(() => {
    const { name, type, contact, channel} = otherContactInfo;
    if (!name || !type || !contact ) return;

    const id = crypto.randomUUID();
    const newContactItem = {
      id,
      type,
      contact,
      channel,
      contactItems: [
        {
          id,
          type,
          contact,
        },
      ],
    };

    toggleSelection(id, name, type, contact, channel);

    setContactData((prev: any) => {
      const existingGroup = prev.find((g: any) => g.name === "Outros");
      if (existingGroup) {
        return prev.map((group: any) =>
          group.name === "Outros"
            ? { ...group, contacts: [...group.contacts, newContactItem] }
            : group
        );
      } else {
        return [
          ...prev,
          {
            name: "Outros",
            documentValue: "000.000.000-00",
            contacts: [newContactItem],
          },
        ];
      }
    });

    setOtherContactInfo({ name: "", type: "", contact: "", channel: ""});
  });

  return {
    contactData,
    toggleSelection,
    isSelected,
    handleAddOtherContact,
    otherContactInfo,
    setOtherContactInfo,
    errors,
    control
  };
}
