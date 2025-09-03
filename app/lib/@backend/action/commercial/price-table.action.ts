"use server";

import { Filter } from "mongodb";
import { IPriceTable } from "../../domain";
import { findManyPriceTableUsecase } from "../../usecase/commercial/price-table/find-many.price-table.usecase";
import { findOnePriceTableUsecase } from "../../usecase/commercial/price-table/find-one.price-table.usecase";
import { createOnePriceTableUsecase } from "../../usecase/commercial/price-table/create-one.price-table.usecase";
import { inactivatePriceTableUsecase } from "../../usecase/commercial/price-table/inactivate.price-table.usecase";
import { updateOnePriceTableUsecase } from "../../usecase/commercial/price-table/update-one.price-table.usecase";

export async function findManyPriceTable(
  filter: Filter<IPriceTable> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyPriceTableUsecase.execute({ filter, page, limit, sort });
}

export const findOnePriceTable = async (filter: Filter<IPriceTable>) => {
  return await findOnePriceTableUsecase.execute(filter);
};

export async function createOnePriceTable(
  input: Omit<IPriceTable, "id" | "created_at" | "updated_at">
) {
  return await createOnePriceTableUsecase.execute(input);
}

export async function updateOnePriceTable(
  input: IPriceTable
) {
  return await updateOnePriceTableUsecase.execute(input);
}

export const inactivatePriceTable = async (id: string) => {
  const result = await inactivatePriceTableUsecase.execute({ id });
  return result;
};
