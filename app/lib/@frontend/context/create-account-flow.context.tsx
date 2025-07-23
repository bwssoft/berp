"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { IAccount, IAddress, IContact } from "../../@backend/domain";
import { toast } from "../hook/use-toast";

interface CreateAccountFlowContextType {
  // Account state
  account: IAccount | null;

  // Address state
  addresses: IAddress[];

  // Contact state
  contacts: IContact[];

  // Account methods
  createAccountLocally: (account: IAccount) => void;
  updateAccountLocally: (id: string, updates: Partial<IAccount>) => void;
  deleteAccountLocally: (id: string) => void;
  setAccount: (account: IAccount | null) => void;

  // Address methods
  createAddressLocally: (address: IAddress) => void;
  updateAddressLocally: (id: string, updates: Partial<IAddress>) => void;
  deleteAddressLocally: (id: string) => void;
  setAddresses: (addresses: IAddress[]) => void;

  // Contact methods
  createContactLocally: (contact: IContact) => void;
  updateContactLocally: (id: string, updates: Partial<IContact>) => void;
  deleteContactLocally: (id: string) => void;
  setContacts: (contacts: IContact[]) => void;

  // Utility methods
  resetFlow: () => void;
}

const CreateAccountFlowContext = createContext<CreateAccountFlowContextType>(
  {} as CreateAccountFlowContextType
);

interface CreateAccountFlowProviderProps {
  children: React.ReactNode;
  initialAccount?: IAccount | null;
  initialAddresses?: IAddress[];
  initialContacts?: IContact[];
}

export const CreateAccountFlowProvider = ({
  children,
  initialAccount = null,
  initialAddresses = [],
  initialContacts = [],
}: CreateAccountFlowProviderProps) => {
  const [account, setAccount] = useState<IAccount | null>(initialAccount);
  const [addresses, setAddresses] = useState<IAddress[]>(initialAddresses);
  const [contacts, setContacts] = useState<IContact[]>(initialContacts);

  // Account methods
  const createAccountLocally = useCallback((newAccount: IAccount) => {
    setAccount(newAccount);
    toast({
      title: "Conta criada localmente",
      description: "A conta foi adicionada ao contexto local.",
      variant: "success",
    });
  }, []);

  const updateAccountLocally = useCallback(
    (id: string, updates: Partial<IAccount>) => {
      setAccount((prevAccount) => {
        if (prevAccount && prevAccount.id === id) {
          return { ...prevAccount, ...updates };
        }
        return prevAccount;
      });
      toast({
        title: "Conta atualizada localmente",
        description: "As alterações foram aplicadas ao contexto local.",
        variant: "success",
      });
    },
    []
  );

  const deleteAccountLocally = useCallback((id: string) => {
    setAccount((prevAccount) => {
      if (prevAccount && prevAccount.id === id) {
        return null;
      }
      return prevAccount;
    });
    // Clear related data when account is deleted
    setAddresses([]);
    setContacts([]);
    toast({
      title: "Conta removida localmente",
      description:
        "A conta e dados relacionados foram removidos do contexto local.",
      variant: "success",
    });
  }, []);

  // Address methods
  const createAddressLocally = useCallback((newAddress: IAddress) => {
    setAddresses((prevAddresses) => {
      const addressWithId = {
        ...newAddress,
        id: newAddress.id || crypto.randomUUID(),
      };
      return [...prevAddresses, addressWithId];
    });
    toast({
      title: "Endereço adicionado localmente",
      description: "O endereço foi adicionado ao contexto local.",
      variant: "success",
    });
  }, []);

  const updateAddressLocally = useCallback(
    (id: string, updates: Partial<IAddress>) => {
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === id ? { ...address, ...updates } : address
        )
      );
      toast({
        title: "Endereço atualizado localmente",
        description: "As alterações foram aplicadas ao contexto local.",
        variant: "success",
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((id: string) => {
    setAddresses((prevAddresses) =>
      prevAddresses.filter((address) => address.id !== id)
    );
    toast({
      title: "Endereço removido localmente",
      description: "O endereço foi removido do contexto local.",
      variant: "success",
    });
  }, []);

  // Contact methods
  const createContactLocally = useCallback((newContact: IContact) => {
    setContacts((prevContacts) => {
      const contactWithId = {
        ...newContact,
        id: newContact.id || crypto.randomUUID(),
      };
      return [...prevContacts, contactWithId];
    });
    toast({
      title: "Contato adicionado localmente",
      description: "O contato foi adicionado ao contexto local.",
      variant: "success",
    });
  }, []);

  const updateContactLocally = useCallback(
    (id: string, updates: Partial<IContact>) => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updates } : contact
        )
      );
      toast({
        title: "Contato atualizado localmente",
        description: "As alterações foram aplicadas ao contexto local.",
        variant: "success",
      });
    },
    []
  );

  const deleteContactLocally = useCallback((id: string) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
    toast({
      title: "Contato removido localmente",
      description: "O contato foi removido do contexto local.",
      variant: "success",
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
