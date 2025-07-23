"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { IAccount, IAddress, IContact } from "../../@backend/domain";
import { toast } from "../hook/use-toast";

interface CreateAccountFlowContextType {
  // Account state
  account: Omit<IAccount, "id" | "created_at" | "updated_at"> | null;

  // Address state
  addresses: Omit<IAddress, "id" | "created_at" | "updated_at">[];

  // Contact state
  contacts: Omit<IContact, "id" | "created_at" | "updated_at">[];

  // Account methods
  createAccountLocally: (
    account: Omit<IAccount, "id" | "created_at" | "updated_at">
  ) => void;
  updateAccountLocally: (
    updates: Partial<Omit<IAccount, "id" | "created_at" | "updated_at">>
  ) => void;
  deleteAccountLocally: () => void;
  setAccount: (
    account: Omit<IAccount, "id" | "created_at" | "updated_at"> | null
  ) => void;

  // Address methods
  createAddressLocally: (
    address: Omit<IAddress, "id" | "created_at" | "updated_at">
  ) => void;
  updateAddressLocally: (
    index: number,
    updates: Partial<Omit<IAddress, "id" | "created_at" | "updated_at">>
  ) => void;
  deleteAddressLocally: (index: number) => void;
  setAddresses: (
    addresses: Omit<IAddress, "id" | "created_at" | "updated_at">[]
  ) => void;

  // Contact methods
  createContactLocally: (
    contact: Omit<IContact, "id" | "created_at" | "updated_at">
  ) => void;
  updateContactLocally: (id: number, updates: Partial<IContact>) => void;
  deleteContactLocally: (id: number) => void;
  setContacts: (contacts: IContact[]) => void;

  // Utility methods
  resetFlow: () => void;
}

const CreateAccountFlowContext = createContext<CreateAccountFlowContextType>(
  {} as CreateAccountFlowContextType
);

export const CreateAccountFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [account, setAccount] = useState<Omit<
    IAccount,
    "id" | "created_at" | "updated_at"
  > | null>(null);
  const [addresses, setAddresses] = useState<
    Omit<IAddress, "id" | "created_at" | "updated_at">[]
  >([]);
  const [contacts, setContacts] = useState<
    Omit<IContact, "id" | "created_at" | "updated_at">[]
  >([]);

  // Account methods
  const createAccountLocally = useCallback(
    (newAccount: Omit<IAccount, "id" | "created_at" | "updated_at">) => {
      setAccount(newAccount);
    },
    []
  );

  const updateAccountLocally = useCallback(
    (updates: Partial<Omit<IAccount, "id" | "created_at" | "updated_at">>) => {
      setAccount((prevAccount) => {
        if (prevAccount) {
          const updatedAccount = { ...prevAccount, ...updates };
          return updatedAccount;
        }
        return prevAccount;
      });
    },
    []
  );

  const deleteAccountLocally = useCallback(() => {
    setAccount(null);
    // Clear related data when account is deleted
    setAddresses([]);
    setContacts([]);
  }, []);

  // Address methods
  const createAddressLocally = useCallback(
    (newAddress: Omit<IAddress, "id" | "created_at" | "updated_at">) => {
      setAddresses((prevAddresses) => {
        return [...prevAddresses, newAddress];
      });
    },
    []
  );

  const updateAddressLocally = useCallback(
    (
      index: number,
      updates: Partial<Omit<IAddress, "id" | "created_at" | "updated_at">>
    ) => {
      setAddresses((prevAddresses) => {
        const updatedAddresses = prevAddresses.map((address, i) =>
          i === index ? { ...address, ...updates } : address
        );
        return updatedAddresses;
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((index: number) => {
    setAddresses((prevAddresses) => {
      const filteredAddresses = prevAddresses.filter((_, i) => i !== index);
      return filteredAddresses;
    });
  }, []);

  // Contact methods
  const createContactLocally = useCallback(
    (newContact: Omit<IContact, "id" | "created_at" | "updated_at">) => {
      setContacts((prevContacts) => {
        return [...prevContacts, newContact];
      });
    },
    []
  );

  const updateContactLocally = useCallback(
    (index: number, updates: Partial<IContact>) => {
      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact, i) =>
          i === index ? { ...contact, ...updates } : contact
        );
        return updatedContacts;
      });
    },
    []
  );

  const deleteContactLocally = useCallback((index: number) => {
    setContacts((prevContacts) => {
      const filteredContacts = prevContacts.filter((_, i) => i !== index);
      return filteredContacts;
    });
  }, []);

  // Utility methods
  const resetFlow = useCallback(() => {
    setAccount(null);
    setAddresses([]);
    setContacts([]);
    toast({
      title: "Fluxo reiniciado",
      description: "Todos os dados do contexto foram limpos.",
      variant: "default",
    });
  }, []);

  const value: CreateAccountFlowContextType = {
    // State
    account,
    addresses,
    contacts,

    // Account methods
    createAccountLocally,
    updateAccountLocally,
    deleteAccountLocally,
    setAccount,

    // Address methods
    createAddressLocally,
    updateAddressLocally,
    deleteAddressLocally,
    setAddresses,

    // Contact methods
    createContactLocally,
    updateContactLocally,
    deleteContactLocally,
    setContacts,

    // Utility methods
    resetFlow,
  };

  return (
    <CreateAccountFlowContext.Provider value={value}>
      {children}
    </CreateAccountFlowContext.Provider>
  );
};

export const useCreateAccountFlow = () => {
  const context = useContext(CreateAccountFlowContext);
  if (!context) {
    throw new Error(
      "useCreateAccountFlow must be used within a CreateAccountFlowProvider"
    );
  }
  return context;
};
