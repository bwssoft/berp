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

import { unmaskPhoneNumber } from "@/app/lib/util/mask-phone-number";

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
      ["Celular", "Telefone Residencial", "Telefone Comercial"].includes(
        contactType
      )
    ) {
      const numericValue = unmaskPhoneNumber(data.contact);
      const isCellphone =
        contactType === "Celular" && numericValue.length !== 11;
      const isLandline =
        (contactType === "Telefone Residencial" ||
          contactType === "Telefone Comercial") &&
        numericValue.length !== 10;

      if (isCellphone || isLandline) {
        ctx.addIssue({
          code: "custom",
          path: ["contact"],
          message:
            contactType === "Celular"
              ? "Celular deve ter 11 dígitos (incluindo DDD)"
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
    setError,
    clearErrors,
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

  const validateAndConfirm = async () => {
    const { name, type, contact } = otherContactInfo;

    clearErrors();

    // Prepare the data for validation
    const formData = {
      name: name || "",
      type: type ? [type] : [],
      contact: contact || "",
    };

    try {
      // Validate against the schema
      const validatedData = schema.parse(formData);

      // If validation passes, select the contact
      const id = "outros-contact";
      toggleSelection(id, name, type, contact, type);
      return true;
    } catch (error) {
      // If validation fails, set errors manually
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
  };
}
