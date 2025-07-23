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
  console.log("🏗️ CreateAccountFlowProvider initializing with:", {
    initialAccount,
    initialAddressesCount: initialAddresses.length,
    initialContactsCount: initialContacts.length,
  });

  const [account, setAccount] = useState<IAccount | null>(initialAccount);
  const [addresses, setAddresses] = useState<IAddress[]>(initialAddresses);
  const [contacts, setContacts] = useState<IContact[]>(initialContacts);

  // Account methods
  const createAccountLocally = useCallback((newAccount: IAccount) => {
    console.log("🔵 createAccountLocally called with:", newAccount);
    setAccount(newAccount);
    console.log("✅ createAccountLocally: Account set successfully");
  }, []);

  const updateAccountLocally = useCallback(
    (id: string, updates: Partial<IAccount>) => {
      console.log(
        "🔵 updateAccountLocally called with id:",
        id,
        "updates:",
        updates
      );
      setAccount((prevAccount) => {
        console.log("🔍 updateAccountLocally: Previous account:", prevAccount);
        if (prevAccount && prevAccount.id === id) {
          const updatedAccount = { ...prevAccount, ...updates };
          console.log(
            "✅ updateAccountLocally: Account updated to:",
            updatedAccount
          );
          return updatedAccount;
        }
        console.log(
          "⚠️ updateAccountLocally: No matching account found for id:",
          id
        );
        return prevAccount;
      });
    },
    []
  );

  const deleteAccountLocally = useCallback((id: string) => {
    console.log("🔵 deleteAccountLocally called with id:", id);
    setAccount((prevAccount) => {
      console.log("🔍 deleteAccountLocally: Previous account:", prevAccount);
      if (prevAccount && prevAccount.id === id) {
        console.log("✅ deleteAccountLocally: Account deleted");
        return null;
      }
      console.log(
        "⚠️ deleteAccountLocally: No matching account found for id:",
        id
      );
      return prevAccount;
    });
    // Clear related data when account is deleted
    console.log("🧹 deleteAccountLocally: Clearing addresses and contacts");
    setAddresses([]);
    setContacts([]);
  }, []);

  // Address methods
  const createAddressLocally = useCallback((newAddress: IAddress) => {
    console.log("🔵 createAddressLocally called with:", newAddress);
    setAddresses((prevAddresses) => {
      const addressWithId = {
        ...newAddress,
        id: newAddress.id || crypto.randomUUID(),
      };
      console.log(
        "✅ createAddressLocally: Address created with id:",
        addressWithId.id
      );
      console.log(
        "📍 createAddressLocally: New addresses count:",
        prevAddresses.length + 1
      );
      return [...prevAddresses, addressWithId];
    });
  }, []);

  const updateAddressLocally = useCallback(
    (id: string, updates: Partial<IAddress>) => {
      console.log(
        "🔵 updateAddressLocally called with id:",
        id,
        "updates:",
        updates
      );
      setAddresses((prevAddresses) => {
        console.log(
          "🔍 updateAddressLocally: Previous addresses:",
          prevAddresses
        );
        const updatedAddresses = prevAddresses.map((address) =>
          address.id === id ? { ...address, ...updates } : address
        );
        const targetAddress = updatedAddresses.find((addr) => addr.id === id);
        if (targetAddress) {
          console.log(
            "✅ updateAddressLocally: Address updated:",
            targetAddress
          );
        } else {
          console.log("⚠️ updateAddressLocally: No address found with id:", id);
        }
        return updatedAddresses;
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((id: string) => {
    console.log("🔵 deleteAddressLocally called with id:", id);
    setAddresses((prevAddresses) => {
      console.log(
        "🔍 deleteAddressLocally: Previous addresses count:",
        prevAddresses.length
      );
      const filteredAddresses = prevAddresses.filter(
        (address) => address.id !== id
      );
      const wasDeleted = filteredAddresses.length < prevAddresses.length;
      if (wasDeleted) {
        console.log(
          "✅ deleteAddressLocally: Address deleted. New count:",
          filteredAddresses.length
        );
      } else {
        console.log("⚠️ deleteAddressLocally: No address found with id:", id);
      }
      return filteredAddresses;
    });
  }, []);

  // Contact methods
  const createContactLocally = useCallback((newContact: IContact) => {
    console.log("🔵 createContactLocally called with:", newContact);
    setContacts((prevContacts) => {
      const contactWithId = {
        ...newContact,
        id: newContact.id || crypto.randomUUID(),
      };
      console.log(
        "✅ createContactLocally: Contact created with id:",
        contactWithId.id
      );
      console.log(
        "📞 createContactLocally: New contacts count:",
        prevContacts.length + 1
      );
      return [...prevContacts, contactWithId];
    });
  }, []);

  const updateContactLocally = useCallback(
    (id: string, updates: Partial<IContact>) => {
      console.log(
        "🔵 updateContactLocally called with id:",
        id,
        "updates:",
        updates
      );
      setContacts((prevContacts) => {
        console.log(
          "🔍 updateContactLocally: Previous contacts:",
          prevContacts
        );
        const updatedContacts = prevContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updates } : contact
        );
        const targetContact = updatedContacts.find(
          (contact) => contact.id === id
        );
        if (targetContact) {
          console.log(
            "✅ updateContactLocally: Contact updated:",
            targetContact
          );
        } else {
          console.log("⚠️ updateContactLocally: No contact found with id:", id);
        }
        return updatedContacts;
      });
    },
    []
  );

  const deleteContactLocally = useCallback((id: string) => {
    console.log("🔵 deleteContactLocally called with id:", id);
    setContacts((prevContacts) => {
      console.log(
        "🔍 deleteContactLocally: Previous contacts count:",
        prevContacts.length
      );
      const filteredContacts = prevContacts.filter(
        (contact) => contact.id !== id
      );
      const wasDeleted = filteredContacts.length < prevContacts.length;
      if (wasDeleted) {
        console.log(
          "✅ deleteContactLocally: Contact deleted. New count:",
          filteredContacts.length
        );
      } else {
        console.log("⚠️ deleteContactLocally: No contact found with id:", id);
      }
      return filteredContacts;
    });
  }, []);

  // Utility methods
  const resetFlow = useCallback(() => {
    console.log("🔵 resetFlow called");
    console.log(
      "🧹 resetFlow: Clearing all data - account, addresses, and contacts"
    );
    setAccount(null);
    setAddresses([]);
    setContacts([]);
    console.log("✅ resetFlow: All data cleared successfully");
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
  console.log("🪝 useCreateAccountFlow hook called");
  const context = useContext(CreateAccountFlowContext);
  if (!context) {
    console.error(
      "❌ useCreateAccountFlow: Context not found - make sure component is wrapped with CreateAccountFlowProvider"
    );
    throw new Error(
      "useCreateAccountFlow must be used within a CreateAccountFlowProvider"
    );
  }
  console.log("✅ useCreateAccountFlow: Context found, returning:", {
    hasAccount: !!context.account,
    addressesCount: context.addresses.length,
    contactsCount: context.contacts.length,
  });
  return context;
};
