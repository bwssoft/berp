"use server";

import { Filter } from "mongodb";
import { IAccount } from "../../domain";
import {
  createOneAccountUsecase,
  findManyAccountUsecase,
  findOneAccountUsecase,
} from "../../usecase/commercial/account";
import { updateOneAccountUsecase } from "../../usecase/commercial/account/update-one.account.usecase";
import { deleteOneAccountUsecase } from "../../usecase/commercial/account/delete-one.account.usecase";
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
  await updateOneAccountUsecase.execute(filter, update);
  revalidatePath(
    `/commercial/account/form/create/tab/contact?id=${filter.accountId}`
  );
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

export async function deleteOneAccount(filter: Partial<IAccount>) {
  const result = await deleteOneAccountUsecase.execute(filter);
  revalidatePath("/commercial");
  return result;
}
