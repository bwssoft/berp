"use client";

import { useState, useEffect } from "react";
import { ContactSelection, IAccount, IContact } from "@/app/lib/@backend/domain";

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

export function useSearchContactHistoricalAccount({
  contacts,
  selectContact,
  setSelectContact,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contactData, setContactData] = useState<Props["contacts"]>([]);
  const [otherContactInfo, setOtherContactInfo] = useState({
    name: "",
    type: "",
    contact: "",
  });

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const onlyWithContacts = contacts.filter(
        (company) => company.contacts && company.contacts.length > 0
      );
      setContactData(onlyWithContacts);
    }
  }, [contacts]);


  const isSelected = (id: string) => selectContact?.id === id;

  const toggleSelection = (
    id: string,
    name: string,
    type: string,
    contact: string
  ) => {
    setSelectContact((prev) => {
      if (prev?.id === id) {
        return undefined;
      } else {
        return { id, name, type, contact };
      }
    });
  };

  const handleAddOtherContact = () => {
    const { name, type, contact } = otherContactInfo;
    if (!name || !type || !contact) return;

    const id = crypto.randomUUID();
    const newContactItem = {
      id,
      type,
      contact,
      contactItems: [
        {
          id,
          type,
          contact,
        },
      ],
    };

    toggleSelection(id, name, type, contact);

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

    setOtherContactInfo({ name: "", type: "", contact: "" });
  };

  return {
    selectedIds,
    setSelectedIds,
    contactData,
    toggleSelection,
    isSelected,
    handleAddOtherContact,
    otherContactInfo,
    setOtherContactInfo,
  };
}
