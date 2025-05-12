import { useState } from "react";

export type ContactList = {
  id?: string;
  type: string;
  contact: string;
  preferredContact: string;
};

export function useContactAccount() {
  const [contactData, setContactData] = useState<ContactList[]>([]);

  const handleNewContact = (
    type: string,
    contact: string,
    preferredContact: string
  ) => {
    setContactData((prev) => [
      ...prev,
      {
        type,
        contact,
        preferredContact,
      },
    ]);
  };
  return { contactData, setContactData, handleNewContact };
}
