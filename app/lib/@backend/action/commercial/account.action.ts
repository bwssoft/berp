"use server";

import { Filter } from "mongodb";
import { IAccount } from "../../domain";
import {
  createOneAccountUsecase,
  findManyAccountUsecase,
  findOneAccountUsecase,
} from "../../usecase/commercial/account";
import { updateOneAccountUsecase } from "../../usecase/commercial/account/update-one.account.usecase";
import { fetchCnpjData } from "../cnpja/cnpja.action";

export async function createOneAccount(
  account: Omit<IAccount, "id" | "created_at">
) {
  const result = await createOneAccountUsecase.execute(account);
  return result;
}

export async function updateOneAccount(
  filter: Filter<IAccount>,
  update: Partial<IAccount>
) {
  const result = await updateOneAccountUsecase.execute(filter, update);
  return result
}

export async function refreshOneAccount(taxId: string) {
  const result = await fetchCnpjData(taxId)
  // descomentar após mergear a branch 16
  // const result = await fetcCnpjRegistrationData(taxId)

  if (!result) return null

  await updateOneAccount({"document.value": taxId}, {
    fantasy_name: result.alias,
    social_name: result.company.name,
    // descomentar após mergear a branch 16
    // status: result?.registrations[0]?.status.text ?? "",
    // state_registration: result?.registrations[0]?.number ?? "",
    // situationIE: {
    //   id: result.registrations[0]?.enabled ? "1" : "2",
    //   text: result.registrations[0]?.enabled ? "Habilitada" : "Não habilitada",
    //   status: result.registrations[0]?.enabled
    // }
    // typeIe: data.registrations[0]?.type.text
  })
  return
}

export const findOneAccount = async (filter: Filter<IAccount>) => {
  return await findOneAccountUsecase.execute(filter);
};

export async function findManyAccount(
  filter: Filter<IAccount> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyAccountUsecase.execute({ filter, page, limit, sort });
}

export async function accountExists(document: string): Promise<boolean> {
  const existing = await findOneAccount({ "document.value": document });
  return Boolean(existing);
}
