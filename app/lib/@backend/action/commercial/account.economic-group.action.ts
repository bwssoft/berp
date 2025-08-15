"use server";

import { Filter } from "mongodb";
import { IAccountEconomicGroup } from "../../domain/commercial/entity/account.economic-group.definition";
import {
  createOneAccountEconomicGroupUsecase,
  findManyAccountEconomicGroupUsecase,
  findOneAccountEconomicGroupUsecase,
  updateOneAccountEconomicGroupUsecase,
  deleteOneAccountEconomicGroupUsecase,
} from "../../usecase/commercial/account-economic-group";
import { revalidatePath } from "next/cache";

export async function createOneAccountEconomicGroup(
  accountEconomicGroup: Omit<IAccountEconomicGroup, "id">
) {
  const result =
    await createOneAccountEconomicGroupUsecase.execute(accountEconomicGroup);
  return result;
}

export async function updateOneAccountEconomicGroup(
  filter: Filter<IAccountEconomicGroup>,
  update: Partial<IAccountEconomicGroup>
) {
  const result = await updateOneAccountEconomicGroupUsecase.execute(
    filter,
    update
  );
  return result;
}

export const findOneAccountEconomicGroup = async (
  filter: Filter<IAccountEconomicGroup>
) => {
  return await findOneAccountEconomicGroupUsecase.execute(filter);
};

export async function findManyAccountEconomicGroup(
  filter: Filter<IAccountEconomicGroup> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyAccountEconomicGroupUsecase.execute({
    filter,
    page,
    limit,
    sort,
  });
}

export async function deleteOneAccountEconomicGroup(
  filter: Partial<IAccountEconomicGroup>
) {
  const result = await deleteOneAccountEconomicGroupUsecase.execute(filter);
  revalidatePath("/commercial");
  return result;
}
