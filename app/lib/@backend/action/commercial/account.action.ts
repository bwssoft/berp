"use server";

import { Filter } from "mongodb";
import { IAccount } from "../../domain";
import {
  createOneAccountUsecase,
  findManyAccountUsecase,
  findOneAccountUsecase,
} from "../../usecase/commercial/account";
import { redirect } from "next/navigation";
import { updateOneAccountUsecase } from "../../usecase/commercial/account/update-one.account.usecase";
import { revalidatePath } from "next/cache";

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
