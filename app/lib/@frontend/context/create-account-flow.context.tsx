"use client";

import { IAccount } from "@/backend/domain/commercial/entity/account.definition";
import { IAccountEconomicGroup } from "@/backend/domain/commercial/entity/account.economic-group.definition";
import { IAddress } from "@/backend/domain/commercial/entity/address.definition";
import { IContact } from "@/backend/domain/commercial/entity/contact.definition";
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

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

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
  resetOnMount = false,
}: {
  children: React.ReactNode;
  resetOnMount?: boolean;
}) => {
  const { user } = useAuth();

  // State to hold the current localStorage data
  const [currentData, setCurrentData] = useState({
    account: null as LocalAccount | null,
    addresses: [] as LocalAddress[],
    contacts: [] as LocalContact[],
    economicGroup: null as LocalAccountEconomicGroup | null,
  });

  // Function to load data from localStorage
  const loadDataFromLocalStorage = useCallback(() => {
    const newData = {
      account: getFromStorage<LocalAccount | null>(STORAGE_KEYS.ACCOUNT, null),
      addresses: getFromStorage<LocalAddress[]>(STORAGE_KEYS.ADDRESSES, []),
      contacts: getFromStorage<LocalContact[]>(STORAGE_KEYS.CONTACTS, []),
      economicGroup: getFromStorage<LocalAccountEconomicGroup | null>(
        STORAGE_KEYS.ECONOMIC_GROUP,
        null
      ),
    };

    setCurrentData(newData);
  }, []);

  // Load data on mount and when localStorage changes
  useEffect(() => {
    loadDataFromLocalStorage();
  }, [loadDataFromLocalStorage]);

  // Listen for localStorage changes and reload data
  useEffect(() => {
    const handleStorageChange = () => {
      loadDataFromLocalStorage();
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadDataFromLocalStorage]);

  // Getter functions that read and JSON parse directly from localStorage
  const getAccount = useCallback((): LocalAccount | null => {
    return currentData.account;
  }, [currentData.account]);

  const getAddresses = useCallback((): LocalAddress[] => {
    const addresses = getFromStorage<LocalAddress[]>(
      STORAGE_KEYS.ADDRESSES,
      []
    );
    // Ensure the parsed addresses is a valid array
    return Array.isArray(addresses) ? addresses : [];
  }, []);

  const getContacts = useCallback((): LocalContact[] => {
    const contacts = getFromStorage<LocalContact[]>(STORAGE_KEYS.CONTACTS, []);
    // Ensure the parsed contacts is a valid array
    return Array.isArray(contacts) ? contacts : [];
  }, []);

  const getEconomicGroup = useCallback((): LocalAccountEconomicGroup | null => {
    const economicGroup = getFromStorage<LocalAccountEconomicGroup | null>(
      STORAGE_KEYS.ECONOMIC_GROUP,
      null
    );
    // Ensure the parsed economic group object is valid
    return economicGroup && typeof economicGroup === "object"
      ? economicGroup
      : null;
  }, []);

  // Setter functions that write and JSON stringify directly to localStorage
  const setAccount = useCallback(
    (newAccount: LocalAccount | null) => {
      if (newAccount && typeof newAccount === "object") {
        setToStorage<LocalAccount>(STORAGE_KEYS.ACCOUNT, newAccount);
      } else {
        removeFromStorage(STORAGE_KEYS.ACCOUNT);
      }

      loadDataFromLocalStorage();
    },
    [loadDataFromLocalStorage]
  );

  const setAddresses = useCallback(
    (newAddresses: LocalAddress[]) => {
      if (Array.isArray(newAddresses)) {
        setToStorage<LocalAddress[]>(STORAGE_KEYS.ADDRESSES, newAddresses);
      }
      loadDataFromLocalStorage();
    },
    [loadDataFromLocalStorage]
  );

  const setContacts = useCallback(
    (newContacts: LocalContact[]) => {
      if (Array.isArray(newContacts)) {
        setToStorage<LocalContact[]>(STORAGE_KEYS.CONTACTS, newContacts);
      }
      loadDataFromLocalStorage();
    },
    [loadDataFromLocalStorage]
  );

  const setEconomicGroup = useCallback(
    (newEconomicGroup: LocalAccountEconomicGroup | null) => {
      if (newEconomicGroup && typeof newEconomicGroup === "object") {
        setToStorage<LocalAccountEconomicGroup>(
          STORAGE_KEYS.ECONOMIC_GROUP,
          newEconomicGroup
        );
      } else {
        removeFromStorage(STORAGE_KEYS.ECONOMIC_GROUP);
      }
      loadDataFromLocalStorage();
    },
    [loadDataFromLocalStorage]
  );

  // Account methods
  const createAccountLocally = useCallback(
    (newAccount: LocalAccount) => {
      setAccount(newAccount);
    },
    [setAccount]
  );

  const updateAccountLocally = useCallback(
    (updates: Partial<LocalAccount>) => {
      const currentAccount = getAccount();
      if (currentAccount) {
        const updatedAccount = { ...currentAccount, ...updates };
        setAccount(updatedAccount);
      }
    },
    [getAccount, setAccount]
  );

  const deleteAccountLocally = useCallback(() => {
    setAccount(null);
    // Clear related data when account is deleted
    setAddresses([]);
    setContacts([]);
    setEconomicGroup(null);
  }, [setAccount, setAddresses, setContacts, setEconomicGroup]);

  // Address methods
  const createAddressLocally = useCallback(
    (newAddress: LocalAddress) => {
      const currentAddresses = getAddresses();
      const updatedAddresses = [...currentAddresses, newAddress];
      setAddresses(updatedAddresses);
    },
    [getAddresses, setAddresses]
  );

  const updateAddressLocally = useCallback(
    (id: string, updates: Partial<LocalAddress>) => {
      const currentAddresses = getAddresses();
      const updatedAddresses = currentAddresses.map((address) => {
        return address.id === id ? { ...address, ...updates } : address;
      });
      setAddresses(updatedAddresses);
    },
    [getAddresses, setAddresses]
  );

  const deleteAddressLocally = useCallback(
    (id: string) => {
      const currentAddresses = getAddresses();
      const filteredAddresses = currentAddresses.filter(
        (address) => address.id !== id
      );
      setAddresses(filteredAddresses);
    },
    [getAddresses, setAddresses]
  );

  // Economic group methods
  const createEconomicGroupLocally = useCallback(
    (newEconomicGroup: LocalAccountEconomicGroup) => {
      setEconomicGroup(newEconomicGroup);
    },
    [setEconomicGroup]
  );

  const updateEconomicGroupLocally = useCallback(
    (updates: Partial<LocalAccountEconomicGroup>) => {
      const currentEconomicGroup = getEconomicGroup();
      if (currentEconomicGroup) {
        const updatedEconomicGroup = { ...currentEconomicGroup, ...updates };
        setEconomicGroup(updatedEconomicGroup);
      }
    },
    [getEconomicGroup, setEconomicGroup]
  );

  const deleteEconomicGroupLocally = useCallback(() => {
    setEconomicGroup(null);
  }, [setEconomicGroup]);

  // Contact methods
  const createContactLocally = useCallback(
    (newContact: LocalContact) => {
      const currentContacts = getContacts();
      const updatedContacts = [...currentContacts, newContact];
      setContacts(updatedContacts);
    },
    [getContacts, setContacts]
  );

  const updateContactLocally = useCallback(
    (id: string, updates: Partial<LocalContact>) => {
      const currentContacts = getContacts();
      const updatedContacts = currentContacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      );
      setContacts(updatedContacts);
    },
    [getContacts, setContacts]
  );

  const deleteContactLocally = useCallback(
    (id: string) => {
      const currentContacts = getContacts();
      const filteredContacts = currentContacts.filter(
        (contact) => contact.id !== id
      );
      setContacts(filteredContacts);
    },
    [getContacts, setContacts]
  );

  // Utility methods
  const resetFlow = useCallback(() => {
    setAccount(null);
    setAddresses([]);
    setContacts([]);
    setEconomicGroup(null);

    // Clear localStorage data
    removeFromStorage(STORAGE_KEYS.ACCOUNT);
    removeFromStorage(STORAGE_KEYS.ADDRESSES);
    removeFromStorage(STORAGE_KEYS.CONTACTS);
    removeFromStorage(STORAGE_KEYS.ECONOMIC_GROUP);
  }, [setAccount, setAddresses, setContacts, setEconomicGroup]);

  // Reset flow on mount if requested (for "Nova Conta" button clicks)
  useEffect(() => {
    if (resetOnMount) {
      resetFlow();
    }
  }, [resetOnMount, resetFlow]);

  // API creation method
  const createEntitiesApi = useCallback(async () => {
    try {
      const account = getAccount();
      const addresses = getAddresses();
      const contacts = getContacts();
      const economicGroup = getEconomicGroup();

      // Continue with account creation even if account data is minimal
      // The API will handle validation and return appropriate errors

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
      // Ensure account has required fields for API
      if (!account?.document?.value) {
        console.error("❌ Account missing required document field");
        return {
          success: false,
          error: "Dados da conta incompletos - documento obrigatório",
        };
      }

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
  }, [getAccount, getAddresses, getContacts, getEconomicGroup, user?.name]);

  // Memoize context value and trigger update when localStorage changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value: CreateAccountFlowContextType = useMemo(
    () => ({
      // State - use current data from state
      account: currentData.account,
      addresses: currentData.addresses,
      contacts: currentData.contacts,
      economicGroup: currentData.economicGroup,

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
    }),
    [
      currentData, // This will change when localStorage data changes
      createAccountLocally,
      updateAccountLocally,
      deleteAccountLocally,
      setAccount,
      createAddressLocally,
      updateAddressLocally,
      deleteAddressLocally,
      setAddresses,
      createContactLocally,
      updateContactLocally,
      deleteContactLocally,
      setContacts,
      createEconomicGroupLocally,
      updateEconomicGroupLocally,
      deleteEconomicGroupLocally,
      setEconomicGroup,
      resetFlow,
      createEntitiesApi,
    ]
  );

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
