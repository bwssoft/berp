"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ContactSelection,
  IAccount,
  IContact,
} from "@/app/lib/@backend/domain";
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
    value:
      | ContactSelection
      | undefined
      | ((prev: ContactSelection | undefined) => ContactSelection | undefined)
  ) => void;
}

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z
    .array(z.string(), { message: "Tipo é obrigatório" })
    .min(1, "Tipo é obrigatório"),
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
    channel: "",
  });
  const hasAutoSelectedRef = useRef(false);

  const {
    formState: { errors },
    control,
    trigger,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

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

  const toggleSelection = useCallback(
    (
      id: string,
      name: string,
      type: string,
      contact: string,
      channel: string
    ) => {
      setSelectContact((prev) => {
        if (prev?.id === id && prev?.channel === channel) {
          return undefined;
        } else {
          return { id, name, type, contact, channel };
        }
      });
    },
    [setSelectContact]
  );

  useEffect(() => {
    const { name, type, contact } = otherContactInfo;

    const validateAndSelect = async () => {
      if (name && type && contact && !hasAutoSelectedRef.current) {
        // Trigger validation for all fields
        const isValid = await trigger();

        if (isValid) {
          const id = "outros-contact";
          toggleSelection(id, name, type, contact, type);
          hasAutoSelectedRef.current = true;
        }
      } else if (!name || !type || !contact) {
        hasAutoSelectedRef.current = false;
        if (selectContact?.id === "outros-contact") {
          setSelectContact(undefined);
        }
      }
    };

    validateAndSelect();
  }, [
    otherContactInfo,
    toggleSelection,
    trigger,
    selectContact,
    setSelectContact,
  ]);

  return {
    contactData,
    toggleSelection,
    isSelected,
    otherContactInfo,
    setOtherContactInfo,
    errors,
    control,
    trigger,
  };
}
