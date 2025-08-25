"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  IAccount,
  IAddress,
  IContact,
  IAccountEconomicGroup,
} from "../../@backend/domain";
import {
  createOneAccount,
  updateOneAccount,
  findOneAccount,
} from "../../@backend/action/commercial/account.action";
import { createOneAddress } from "../../@backend/action/commercial/address.action";
import { createOneContact } from "../../@backend/action/commercial/contact.action";
import { createOneHistorical } from "../../@backend/action/commercial/historical.action";
import {
  createOneAccountEconomicGroup,
  findOneAccountEconomicGroup,
  updateOneAccountEconomicGroup,
} from "../../@backend/action/commercial/account.economic-group.action";
import { useAuth } from "./auth.context";

// Extended types with local IDs
export type LocalAccount = Omit<IAccount, "created_at" | "updated_at">;

export type LocalAddress = Omit<IAddress, "created_at" | "updated_at">;

export type LocalContact = Omit<IContact, "created_at" | "updated_at">;

export type LocalAccountEconomicGroup = Omit<IAccountEconomicGroup, "id">;

const STORAGE_KEYS = {
  ACCOUNT: "create_account_flow_account",
  ADDRESSES: "create_account_flow_addresses",
  CONTACTS: "create_account_flow_contacts",
  ECONOMIC_GROUP: "create_account_flow_economic_group",
} as const;

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
  }
}

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

  // Initialize state from localStorage or defaults
  const [account, setAccountState] = useState<LocalAccount | null>(() =>
    getFromStorage(STORAGE_KEYS.ACCOUNT, null)
  );
  const [addresses, setAddressesState] = useState<LocalAddress[]>(() =>
    getFromStorage(STORAGE_KEYS.ADDRESSES, [])
  );
  const [contacts, setContactsState] = useState<LocalContact[]>(() =>
    getFromStorage(STORAGE_KEYS.CONTACTS, [])
  );
  const [economicGroup, setEconomicGroupState] =
    useState<LocalAccountEconomicGroup | null>(() =>
      getFromStorage(STORAGE_KEYS.ECONOMIC_GROUP, null)
    );

  // Wrapper functions that update both state and localStorage
  const setAccount = useCallback((newAccount: LocalAccount | null) => {
    setAccountState(newAccount);
    if (newAccount) {
      setToStorage(STORAGE_KEYS.ACCOUNT, newAccount);
    } else {
      removeFromStorage(STORAGE_KEYS.ACCOUNT);
    }
  }, []);

  const setAddresses = useCallback((newAddresses: LocalAddress[]) => {
    setAddressesState(newAddresses);
    setToStorage(STORAGE_KEYS.ADDRESSES, newAddresses);
  }, []);

  const setContacts = useCallback((newContacts: LocalContact[]) => {
    setContactsState(newContacts);
    setToStorage(STORAGE_KEYS.CONTACTS, newContacts);
  }, []);

  const setEconomicGroup = useCallback(
    (newEconomicGroup: LocalAccountEconomicGroup | null) => {
      setEconomicGroupState(newEconomicGroup);
      if (newEconomicGroup) {
        setToStorage(STORAGE_KEYS.ECONOMIC_GROUP, newEconomicGroup);
      } else {
        removeFromStorage(STORAGE_KEYS.ECONOMIC_GROUP);
      }
    },
    []
  );

  // Account methods
  const createAccountLocally = useCallback(
    (newAccount: LocalAccount) => {
      setAccount(newAccount);
    },
    [setAccount]
  );

  const updateAccountLocally = useCallback((updates: Partial<LocalAccount>) => {
    setAccountState((prevAccount) => {
      if (prevAccount) {
        const updatedAccount = { ...prevAccount, ...updates };
        setToStorage(STORAGE_KEYS.ACCOUNT, updatedAccount);
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
  }, [setAccount, setAddresses, setContacts, setEconomicGroup]);

  // Address methods
  const createAddressLocally = useCallback((newAddress: LocalAddress) => {
    setAddressesState((prevAddresses) => {
      const updatedAddresses = [...prevAddresses, newAddress];
      setToStorage(STORAGE_KEYS.ADDRESSES, updatedAddresses);
      return updatedAddresses;
    });
  }, []);

  const updateAddressLocally = useCallback(
    (id: string, updates: Partial<LocalAddress>) => {
      setAddressesState((prevAddresses) => {
        const updatedAddresses = prevAddresses.map((address) => {
          return address.id === id ? { ...address, ...updates } : address;
        });
        setToStorage(STORAGE_KEYS.ADDRESSES, updatedAddresses);
        return updatedAddresses;
      });
    },
    []
  );

  const deleteAddressLocally = useCallback((id: string) => {
    setAddressesState((prevAddresses) => {
      const filteredAddresses = prevAddresses.filter(
        (address) => address.id !== id
      );
      setToStorage(STORAGE_KEYS.ADDRESSES, filteredAddresses);
      return filteredAddresses;
    });
  }, []);

  // Economic group methods
  const createEconomicGroupLocally = useCallback(
    (newEconomicGroup: LocalAccountEconomicGroup) => {
      setEconomicGroup(newEconomicGroup);
    },
    [setEconomicGroup]
  );

  const updateEconomicGroupLocally = useCallback(
    (updates: Partial<LocalAccountEconomicGroup>) => {
      setEconomicGroupState((prevEconomicGroup) => {
        if (prevEconomicGroup) {
          const updatedEconomicGroup = { ...prevEconomicGroup, ...updates };
          setToStorage(STORAGE_KEYS.ECONOMIC_GROUP, updatedEconomicGroup);
          return updatedEconomicGroup;
        }
        return prevEconomicGroup;
      });
    },
    []
  );

  const deleteEconomicGroupLocally = useCallback(() => {
    setEconomicGroup(null);
  }, [setEconomicGroup]);

  // Contact methods
  const createContactLocally = useCallback((newContact: LocalContact) => {
    setContactsState((prevContacts) => {
      const updatedContacts = [...prevContacts, newContact];
      setToStorage(STORAGE_KEYS.CONTACTS, updatedContacts);
      return updatedContacts;
    });
  }, []);

  const updateContactLocally = useCallback(
    (id: string, updates: Partial<LocalContact>) => {
      setContactsState((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updates } : contact
        );
        setToStorage(STORAGE_KEYS.CONTACTS, updatedContacts);
        return updatedContacts;
      });
    },
    []
  );

  const deleteContactLocally = useCallback((id: string) => {
    setContactsState((prevContacts) => {
      const filteredContacts = prevContacts.filter(
        (contact) => contact.id !== id
      );
      setToStorage(STORAGE_KEYS.CONTACTS, filteredContacts);
      return filteredContacts;
    });
  }, []);

  // Utility methods
  const resetFlow = useCallback(() => {
    setAccount(null);
    setAddresses([]);
    setContacts([]);
    setEconomicGroup(null);
  }, [setAccount, setAddresses, setContacts, setEconomicGroup]);

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
              "economic_group_holding.taxId":
                economicGroup.economic_group_holding.taxId,
            });
          }

          if (existingEconomicGroup) {
            // Update the existing economic group by adding new controlled companies
            const existingControlled =
              existingEconomicGroup.economic_group_controlled || [];
            const newControlled = economicGroup.economic_group_controlled || [];

            const newTaxIds = newControlled.map((company) =>
              company.taxId.replace(/\D/g, "")
            );

            // Find companies that were removed from the controlled list
            const removedAccounts = existingControlled.filter((company) => {
              const cleanTaxId = company.taxId.replace(/\D/g, "");
              return !newTaxIds.includes(cleanTaxId);
            });

            // Disconnect removed accounts from economic group
            if (removedAccounts.length > 0) {
              try {
                for (const removedAccount of removedAccounts) {
                  await updateOneAccount(
                    { "document.value": removedAccount.taxId },
                    { economicGroupId: "" }
                  );

                  console.log(
                    `Disconnected account ${removedAccount.name} (${removedAccount.taxId}) from economic group`
                  );
                }
              } catch (error) {
                console.warn(
                  "Failed to disconnect some accounts from economic group:",
                  error
                );
              }
            }

            // Find companies that were added to the controlled list
            const existingTaxIds = existingControlled.map((company) =>
              company.taxId.replace(/\D/g, "")
            );
            const addedAccounts = newControlled.filter((company) => {
              const cleanTaxId = company.taxId.replace(/\D/g, "");
              return !existingTaxIds.includes(cleanTaxId);
            });

            // Connect newly added accounts to economic group
            if (addedAccounts.length > 0) {
              try {
                for (const addedAccount of addedAccounts) {
                  // Find account by taxId first, then update by ID
                  const accountToConnect = await findOneAccount({
                    "document.value": addedAccount.taxId,
                  });

                  if (accountToConnect?.id) {
                    await updateOneAccount(
                      { id: accountToConnect.id },
                      { economicGroupId: existingEconomicGroup.id! }
                    );

                    console.log(
                      `Connected account ${addedAccount.name} (${addedAccount.taxId}) to existing economic group ${existingEconomicGroup.id}`
                    );
                  }
                }
              } catch (error) {
                console.warn(
                  "Failed to connect some accounts to economic group:",
                  error
                );
              }
            }

            // Merge controlled companies, avoiding duplicates based on taxId
            const mergedControlled = [...existingControlled];

            newControlled.forEach((newCompany) => {
              const exists = existingControlled.some(
                (existing) =>
                  existing.taxId.replace(/\D/g, "") ===
                  newCompany.taxId.replace(/\D/g, "")
              );
              if (!exists) {
                mergedControlled.push(newCompany);
              }
            });

            // Filter out removed companies from the merged list
            const finalControlled = mergedControlled.filter((company) => {
              const cleanTaxId = company.taxId.replace(/\D/g, "");
              return newTaxIds.includes(cleanTaxId);
            });

            const updateData = {
              economic_group_holding: economicGroup.economic_group_holding,
              economic_group_controlled: finalControlled,
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
              economic_group_controlled:
                economicGroup.economic_group_controlled,
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

      // 2.1. Connect controlled accounts to economic group if economic group was created/updated
      if (economicGroupId && economicGroup?.economic_group_controlled) {
        try {
          for (const controlledAccount of economicGroup.economic_group_controlled) {
            // Find account by taxId first, then update by ID
            const accountToConnect = await findOneAccount({
              "document.value": controlledAccount.taxId,
            });

            if (accountToConnect?.id) {
              await updateOneAccount(
                { id: accountToConnect.id },
                { economicGroupId }
              );

              console.log(
                `Connected controlled account ${controlledAccount.name} (${controlledAccount.taxId}) to economic group ${economicGroupId}`
              );
            }
          }
        } catch (error) {
          console.warn(
            "Failed to connect some controlled accounts to economic group:",
            error
          );
        }
      }

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
            const actionType = economicGroupWasUpdated
              ? "atualizado"
              : "vinculado";
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

            const actionType = economicGroupWasUpdated
              ? "atualizada"
              : "vinculada";
            const actionTypePlural = economicGroupWasUpdated
              ? "atualizadas"
              : "vinculadas";
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
