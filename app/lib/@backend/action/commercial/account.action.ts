"use server";

import { Filter } from "mongodb";
import { IAccount } from "@/backend/domain/commercial/entity/account.definition";
import { createOneAccountUsecase } from "../../usecase/commercial/account/create-one.account.usecase";
import { findManyAccountUsecase } from "../../usecase/commercial/account/find-many.account.usecase";
import { findOneAccountUsecase } from "../../usecase/commercial/account/find-one.account.usecase";
import { updateOneAccountUsecase } from "../../usecase/commercial/account/update-one.account.usecase";
import { fetcCnpjRegistrationData } from "../cnpja/cnpja.action";
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
  const result = await updateOneAccountUsecase.execute(filter, update);
  return result;
}

export async function refreshOneAccount(taxId: string, id: string) {
  const result = await fetcCnpjRegistrationData(taxId);

  if (!result) return null;

  await updateOneAccount(
    { id: id },
    {
      fantasy_name: result.alias,
      social_name: result.company.name,
      status: result?.registrations[0]?.status.text ?? "",
      state_registration: result?.registrations[0]?.number ?? "",
      situationIE: {
        id: result.registrations[0]?.enabled ? "1" : "2",
        text: result.registrations[0]?.enabled
          ? "Habilitada"
          : "Não habilitada",
        status: result.registrations[0]?.enabled,
      },
      typeIE: result.registrations[0]?.type.text,
    }
  );
  return;
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
