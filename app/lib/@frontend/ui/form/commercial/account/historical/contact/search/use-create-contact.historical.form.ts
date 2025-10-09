"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {ContactSelection} from "@/app/lib/@backend/domain/commercial/entity/historical.definition";
import {IAccount} from "@/app/lib/@backend/domain/commercial/entity/account.definition";
import {IContact} from "@/app/lib/@backend/domain/commercial/entity/contact.definition";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { unmaskPhoneNumber } from "@/app/lib/util/mask-phone-number";
import { ContactListItem } from "@/app/lib/@frontend/ui/modal/comercial/historical/contact/search/types";

interface Props {
  contacts?: ContactListItem[];
  accountData?: IAccount;
  selectContact: ContactSelection | undefined;
  setSelectContact: (
    value:
      | ContactSelection
      | undefined
      | ((prev: ContactSelection | undefined) => ContactSelection | undefined)
  ) => void;
}

const schema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z
      .array(z.string(), { message: "Tipo é obrigatório" })
      .min(1, "Tipo é obrigatório"),
    contact: z.string().min(1, "Contato é obrigatório"),
  })
  .superRefine((data, ctx) => {
    const contactType = data.type[0]; // Get the first selected type

    if (contactType === "Email") {
      const emailValidation = z
        .string()
        .email("Email inválido")
        .safeParse(data.contact);
      if (!emailValidation.success) {
        ctx.addIssue({
          code: "custom",
          path: ["contact"],
          message: "Email inválido",
        });
      }
    }

    if (
      [
        "Celular",
        "Whatsapp",
        "Telefone Residencial",
        "Telefone Comercial",
      ].includes(contactType)
    ) {
      const numericValue = unmaskPhoneNumber(data.contact);
      const isCellphone =
        (contactType === "Celular" || contactType === "Whatsapp") &&
        numericValue.length !== 11;
      const isLandline =
        (contactType === "Telefone Residencial" ||
          contactType === "Telefone Comercial") &&
        numericValue.length !== 10;

      if (isCellphone || isLandline) {
        ctx.addIssue({
          code: "custom",
          path: ["contact"],
          message:
            contactType === "Celular" || contactType === "Whatsapp"
              ? "Celular/WhatsApp deve ter 11 dígitos (incluindo DDD)"
              : "Telefone deve ter 10 dígitos (incluindo DDD)",
        });
      }
    }
  });

export function useSearchContactHistoricalAccount({
  contacts,
  selectContact,
  setSelectContact,
}: Props) {
  const [contactData, setContactData] = useState<Props["contacts"]>([]);
  const [tempSelectedContact, setTempSelectedContact] = useState<
    ContactSelection | undefined
  >(undefined);
  const [otherContactInfo, setOtherContactInfo] = useState({
    name: "",
    type: "",
    contact: "",
  });
  const hasAutoSelectedRef = useRef(false);

  const {
    formState: { errors },
    control,
    trigger,
    setError,
    clearErrors,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const onlyWithContacts = contacts.filter(
        (contact) => contact.contactItems && contact.contactItems.length > 0
      );
      setContactData(onlyWithContacts);
    }
  }, [contacts]);

  const isSelected = (id: string, type: string) =>
    tempSelectedContact?.id === id && tempSelectedContact?.type === type;

  const toggleSelection = useCallback(
    (id: string, name: string, type: string, contact: string) => {
      setTempSelectedContact((prev) => {
        if (prev?.id === id && prev?.type === type) {
          return undefined;
        } else {
          return { id, name, type, contact };
        }
      });
    },
    []
  );

  useEffect(() => {
    const { name, type, contact } = otherContactInfo;

    const validateAndSelect = async () => {
      if (name && type && contact && !hasAutoSelectedRef.current) {
        // Trigger validation for all fields
        const isValid = await trigger();

        if (isValid) {
          const id = "outros-contact";
          setTempSelectedContact({ id, name, type, contact });
          hasAutoSelectedRef.current = true;
        }
      } else if (!name || !type || !contact) {
        hasAutoSelectedRef.current = false;
        if (tempSelectedContact?.id === "outros-contact") {
          setTempSelectedContact(undefined);
        }
      }
    };

    validateAndSelect();
  }, [otherContactInfo, trigger, tempSelectedContact]);

  const validateAndConfirm = async () => {
    // Check if we have a temporary selection (either from existing contacts or outros form)
    if (!tempSelectedContact) {
      return false; // No selection made
    }

    // If it's an "outros" contact, validate the form
    if (tempSelectedContact.id === "outros-contact") {
      const { name, type, contact } = otherContactInfo;

      clearErrors();

      const formData = {
        name: name || "",
        type: type ? [type] : [],
        contact: contact || "",
      };

      try {
        schema.parse(formData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            const field = err.path[0] as keyof typeof formData;
            setError(field, {
              type: "manual",
              message: err.message,
            });
          });
        }
        return false;
      }
    }

    setSelectContact(tempSelectedContact);
    return true;
  };

  return {
    contactData,
    toggleSelection,
    isSelected,
    otherContactInfo,
    setOtherContactInfo,
    errors,
    control,
    trigger,
    validateAndConfirm,
    clearErrors,
    tempSelectedContact,
  };
}
