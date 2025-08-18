"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  IAccount,
  IAddress,
  IContact,
  IAccountEconomicGroup,
} from "../../@backend/domain";
import { createOneAccount } from "../../@backend/action/commercial/account.action";
import { createOneAddress } from "../../@backend/action/commercial/address.action";
import { createOneContact } from "../../@backend/action/commercial/contact.action";
import { createOneHistorical } from "../../@backend/action/commercial/historical.action";
import { createOneAccountEconomicGroup, findOneAccountEconomicGroup, updateOneAccountEconomicGroup } from "../../@backend/action/commercial/account.economic-group.action";
import { useAuth } from "./auth.context";

// Extended types with local IDs
export type LocalAccount = Omit<IAccount, "created_at" | "updated_at">;

export type LocalAddress = Omit<IAddress, "created_at" | "updated_at">;

export type LocalContact = Omit<IContact, "created_at" | "updated_at">;

export type LocalAccountEconomicGroup = Omit<IAccountEconomicGroup, "id">;

interface CreateAccountFlowContextType {
  // Account state
  account: LocalAccount | null;

  // Address state
  addresses: LocalAddress[];

  // Contact state
  contacts: LocalContact[];

  // Economic group state
  economicGroup: LocalAccountEconomicGroup | null;

  // Account methods
  createAccountLocally: (account: LocalAccount) => void;
  updateAccountLocally: (updates: Partial<LocalAccount>) => void;
  deleteAccountLocally: () => void;
  setAccount: (account: LocalAccount | null) => void;

  // Address methods
  createAddressLocally: (address: LocalAddress) => void;
  updateAddressLocally: (id: string, updates: Partial<LocalAddress>) => void;
  deleteAddressLocally: (id: string) => void;
  setAddresses: (addresses: LocalAddress[]) => void;

  // Contact methods
  createContactLocally: (contact: LocalContact) => void;
  updateContactLocally: (id: string, updates: Partial<LocalContact>) => void;
  deleteContactLocally: (id: string) => void;
  setContacts: (contacts: LocalContact[]) => void;

  // Economic group methods
  createEconomicGroupLocally: (
    economicGroup: LocalAccountEconomicGroup
  ) => void;
  updateEconomicGroupLocally: (
    updates: Partial<LocalAccountEconomicGroup>
  ) => void;
  deleteEconomicGroupLocally: () => void;
  setEconomicGroup: (economicGroup: LocalAccountEconomicGroup | null) => void;

  // Utility methods
  resetFlow: () => void;

  // API creation method
  createEntitiesApi: () => Promise<{
    success: boolean;
    accountId?: string;
    error?: string;
  }>;
}

const CreateAccountFlowContext = createContext<CreateAccountFlowContextType>(
  {} as CreateAccountFlowContextType
);

export const CreateAccountFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [addresses, setAddresses] = useState<LocalAddress[]>([]);
  const [contacts, setContacts] = useState<LocalContact[]>([]);
  const [economicGroup, setEconomicGroup] =
    useState<LocalAccountEconomicGroup | null>(null);

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
    setEconomicGroup(null);
  }, []);

  // Address methods
  const createAddressLocally = useCallback((newAddress: LocalAddress) => {
    setAddresses((prevAddresses) => {
      return [...prevAddresses, newAddress];
    });
  }, []);

  const updateAddressLocally = useCallback(
    (id: string, updates: Partial<LocalAddress>) => {
      setAddresses((prevAddresses) => {
        const updatedAddresses = prevAddresses.map((address) => {
          return address.id === id ? { ...address, ...updates } : address;
        });
        return updatedAddresses;
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((id: string) => {
    setAddresses((prevAddresses) => {
      const filteredAddresses = prevAddresses.filter(
        (address) => address.id !== id
      );
      return filteredAddresses;
    });
  }, []);

  // Economic group methods
  const createEconomicGroupLocally = useCallback(
    (newEconomicGroup: LocalAccountEconomicGroup) => {
      setEconomicGroup(newEconomicGroup);
    },
    []
  );

  const updateEconomicGroupLocally = useCallback(
    (updates: Partial<LocalAccountEconomicGroup>) => {
      setEconomicGroup((prevEconomicGroup) => {
        if (prevEconomicGroup) {
          return { ...prevEconomicGroup, ...updates };
        }
        return prevEconomicGroup;
      });
    },
    []
  );

  const deleteEconomicGroupLocally = useCallback(() => {
    setEconomicGroup(null);
  }, []);

  // Contact methods
  const createContactLocally = useCallback((newContact: LocalContact) => {
    setContacts((prevContacts) => {
      return [...prevContacts, newContact];
    });
  }, []);

  const updateContactLocally = useCallback(
    (id: string, updates: Partial<LocalContact>) => {
      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updates } : contact
        );
        return updatedContacts;
      });
    },
    []
  );

  const deleteContactLocally = useCallback((id: string) => {
    setContacts((prevContacts) => {
      const filteredContacts = prevContacts.filter(
        (contact) => contact.id !== id
      );
      return filteredContacts;
    });
  }, []);

  // Utility methods
  const resetFlow = useCallback(() => {
    setAccount(null);
    setAddresses([]);
    setContacts([]);
    setEconomicGroup(null);
  }, []);

  // API creation method
  const createEntitiesApi = useCallback(async () => {
    try {
      if (!account) {
        return { success: false, error: "Nenhuma conta encontrada para criar" };
      }

      let economicGroupId: string | undefined;
      let economicGroupWasUpdated = false;

      if (economicGroup) {
        try {
          // Check if an economic group already exists with the same holding taxId
          let existingEconomicGroup = null;
          
          if (economicGroup.economic_group_holding?.taxId) {
            existingEconomicGroup = await findOneAccountEconomicGroup({
              "economic_group_holding.taxId": economicGroup.economic_group_holding.taxId,
            });
          }

          if (existingEconomicGroup) {
            // Update the existing economic group by adding new controlled companies
            const existingControlled = existingEconomicGroup.economic_group_controlled || [];
            const newControlled = economicGroup.economic_group_controlled || [];
            
            // Merge controlled companies, avoiding duplicates based on taxId
            const mergedControlled = [...existingControlled];
            
            newControlled.forEach((newCompany) => {
              const exists = existingControlled.some(
                (existing) => existing.taxId === newCompany.taxId
              );
              if (!exists) {
                mergedControlled.push(newCompany);
              }
            });

            const updateData = {
              economic_group_holding: economicGroup.economic_group_holding,
              economic_group_controlled: mergedControlled,
            };

            const economicGroupResult = await updateOneAccountEconomicGroup(
              { id: existingEconomicGroup.id! },
              updateData
            );

            if (economicGroupResult.success && economicGroupResult.data?.id) {
              economicGroupId = economicGroupResult.data.id;
              economicGroupWasUpdated = true;
            }
          } else {
            // Create new economic group if none exists
            const economicGroupData = {
              economic_group_holding: economicGroup.economic_group_holding,
              economic_group_controlled: economicGroup.economic_group_controlled,
            };

            const economicGroupResult =
              await createOneAccountEconomicGroup(economicGroupData);

            if (economicGroupResult.success && economicGroupResult.data?.id) {
              economicGroupId = economicGroupResult.data.id;
              economicGroupWasUpdated = false;
            }
          }
        } catch (error) {
          console.warn("Failed to create/update economic group:", error);
        }
      }

      // 2. Create the account with economic group ID
      const accountData = {
        ...account,
        economicGroupId,
      };

      const accountResult = await createOneAccount(accountData);

      if (!accountResult.success || !accountResult.id) {
        return {
          success: false,
          error: accountResult.error?.global || "Erro ao criar conta",
        };
      }

      const createdAccountId = accountResult.id;

      await createOneHistorical({
        accountId: createdAccountId,
        title: "Cadastro da conta.",
        type: "manual",
        author: {
          name: user?.name ?? "",
          avatarUrl: "",
        },
      });

      // 2. Create addresses with the account ID
      for (const address of addresses) {
        try {
          const addressData = {
            ...address,
            accountId: createdAccountId,
          };
          await createOneAddress(addressData);

          // Create historical entry for address creation
          await createOneHistorical({
            accountId: createdAccountId,
            title: `Endereço ${address.type?.join(", ") || "comercial"} adicionado.`,
            type: "manual",
            author: {
              name: user?.name ?? "",
              avatarUrl: "",
            },
          });
        } catch (error) {
          console.warn("Failed to create address:", error);
        }
      }

      // 3. Create contacts with the account ID
      for (const contact of contacts) {
        try {
          const contactData = {
            ...contact,
            accountId: createdAccountId,
          };
          await createOneContact(contactData);

          // Create historical entry for contact creation
          await createOneHistorical({
            accountId: createdAccountId,
            title: `Contato "${contact.name}" adicionado.`,
            type: "manual",
            author: {
              name: user?.name ?? "",
              avatarUrl: "",
            },
          });
        } catch (error) {
          console.warn("Failed to create contact:", error);
        }
      }

      // 4. Create historical entries for economic groups if they exist
      if (economicGroup) {
        if (economicGroup.economic_group_holding) {
          try {
            const actionType = economicGroupWasUpdated ? "atualizado" : "vinculado";
            await createOneHistorical({
              accountId: createdAccountId,
              title: `Grupo econômico (Holding) "${economicGroup.economic_group_holding.name}" ${actionType}.`,
              type: "manual",
              author: {
                name: user?.name ?? "",
                avatarUrl: "",
              },
            });
          } catch (error) {
            console.warn("Failed to create holding historical entry:", error);
          }
        }

        if (
          economicGroup.economic_group_controlled &&
          economicGroup.economic_group_controlled.length > 0
        ) {
          try {
            const controlledCount =
              economicGroup.economic_group_controlled.length;
            const isPlural = controlledCount > 1;
            const pluralSuffix = isPlural ? "s" : "";
            const controlledNames = economicGroup.economic_group_controlled
              .map((company) => company.name)
              .join(", ");

            const actionType = economicGroupWasUpdated ? "atualizada" : "vinculada";
            const actionTypePlural = economicGroupWasUpdated ? "atualizadas" : "vinculadas";
            const finalActionType = isPlural ? actionTypePlural : actionType;

            await createOneHistorical({
              accountId: createdAccountId,
              title: `Empresa${pluralSuffix} controlada${pluralSuffix} "${controlledNames}" ${finalActionType}.`,
              type: "manual",
              author: {
                name: user?.name ?? "",
                avatarUrl: "",
              },
            });
          } catch (error) {
            console.warn(
              "Failed to create controlled companies historical entry:",
              error
            );
          }
        }
      }

      return {
        success: true,
        accountId: createdAccountId,
      };
    } catch (error) {
      console.error("Error creating entities:", error);
      return {
        success: false,
        error: "Erro inesperado ao criar entidades",
      };
    }
  }, [account, addresses, contacts, economicGroup, user?.name]);

  const value: CreateAccountFlowContextType = {
    // State
    account,
    addresses,
    contacts,
    economicGroup,

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

    // Economic group methods
    createEconomicGroupLocally,
    updateEconomicGroupLocally,
    deleteEconomicGroupLocally,
    setEconomicGroup,

    // Utility methods
    resetFlow,

    // API creation method
    createEntitiesApi,
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
