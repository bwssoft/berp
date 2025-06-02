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

  if (result.error) return result;
  redirect(`/commercial/account/form/create/tab/address?id=${result.id}`);
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

export async function accountExists(document: string): Promise<boolean> {
  const existing = await findOneAccount({ "document.value": document });
  return Boolean(existing);
}
