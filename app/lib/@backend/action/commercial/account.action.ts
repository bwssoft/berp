"use server";

import { Filter } from "mongodb";
import { IAccount } from "../../domain";
import {
  createOneAccountUsecase,
  findManyAccountUsecase,
} from "../../usecase/commercial/account";

export async function createOneAccount(
  account: Omit<IAccount, "id" | "created_at">
) {
  return await createOneAccountUsecase.execute(account);
}

export async function findManyAccount(
  filter: Filter<IAccount> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyAccountUsecase.execute({ filter, page, limit, sort });
}

export const findOneAccount = async (filter: Filter<IAccount>) => {
  //   return await findOneAccountUsecase.execute(filter);
};
