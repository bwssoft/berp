"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { IAccount, IAddress, IContact } from "../../@backend/domain";
import { toast } from "../hook/use-toast";

// Extended types with local IDs
export type LocalAccount = Omit<
  IAccount,
  "id" | "created_at" | "updated_at"
> & {
  idLocal: string;
};

export type LocalAddress = Omit<
  IAddress,
  "id" | "created_at" | "updated_at"
> & {
  idLocal: string;
};

export type LocalContact = Omit<
  IContact,
  "id" | "created_at" | "updated_at"
> & {
  idLocal: string;
};

interface CreateAccountFlowContextType {
  // Account state
  account: LocalAccount | null;

  // Address state
  addresses: LocalAddress[];

  // Contact state
  contacts: LocalContact[];

  // Account methods
  createAccountLocally: (account: LocalAccount) => void;
  updateAccountLocally: (updates: Partial<LocalAccount>) => void;
  deleteAccountLocally: () => void;
  setAccount: (account: LocalAccount | null) => void;

  // Address methods
  createAddressLocally: (address: LocalAddress) => void;
  updateAddressLocally: (
    idLocal: string,
    updates: Partial<LocalAddress>
  ) => void;
  deleteAddressLocally: (idLocal: string) => void;
  setAddresses: (addresses: LocalAddress[]) => void;

  // Contact methods
  createContactLocally: (contact: LocalContact) => void;
  updateContactLocally: (
    idLocal: string,
    updates: Partial<LocalContact>
  ) => void;
  deleteContactLocally: (idLocal: string) => void;
  setContacts: (contacts: LocalContact[]) => void;

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
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [addresses, setAddresses] = useState<LocalAddress[]>([]);
  const [contacts, setContacts] = useState<LocalContact[]>([]);

  // Account methods
  const createAccountLocally = useCallback((newAccount: LocalAccount) => {
    setAccount(newAccount);
  }, []);

  const updateAccountLocally = useCallback((updates: Partial<LocalAccount>) => {
    setAccount((prevAccount) => {
      if (prevAccount) {
        const updatedAccount = { ...prevAccount, ...updates };
        return updatedAccount;
      }
      return prevAccount;
    });
  }, []);

  const deleteAccountLocally = useCallback(() => {
    setAccount(null);
    // Clear related data when account is deleted
    setAddresses([]);
    setContacts([]);
  }, []);

  // Address methods
  const createAddressLocally = useCallback((newAddress: LocalAddress) => {
    setAddresses((prevAddresses) => {
      return [...prevAddresses, newAddress];
    });
  }, []);

  const updateAddressLocally = useCallback(
    (idLocal: string, updates: Partial<LocalAddress>) => {
      setAddresses((prevAddresses) => {
        const updatedAddresses = prevAddresses.map((address) =>
          address.idLocal === idLocal ? { ...address, ...updates } : address
        );
        return updatedAddresses;
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((idLocal: string) => {
    setAddresses((prevAddresses) => {
      const filteredAddresses = prevAddresses.filter(
        (address) => address.idLocal !== idLocal
      );
      return filteredAddresses;
    });
  }, []);

  // Contact methods
  const createContactLocally = useCallback((newContact: LocalContact) => {
    setContacts((prevContacts) => {
      return [...prevContacts, newContact];
    });
  }, []);

  const updateContactLocally = useCallback(
    (idLocal: string, updates: Partial<LocalContact>) => {
      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) =>
          contact.idLocal === idLocal ? { ...contact, ...updates } : contact
        );
        return updatedContacts;
      });
    },
    []
  );

  const deleteContactLocally = useCallback((idLocal: string) => {
    setContacts((prevContacts) => {
      const filteredContacts = prevContacts.filter(
        (contact) => contact.idLocal !== idLocal
      );
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
