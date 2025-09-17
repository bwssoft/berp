"use server";

import { Filter } from "mongodb";
import { IPriceTable, IPriceTableConditionGroup } from "../../domain";
import { findManyPriceTableUsecase } from "../../usecase/commercial/price-table/find-many.price-table.usecase";
import { findOnePriceTableUsecase } from "../../usecase/commercial/price-table/find-one.price-table.usecase";
import { createOnePriceTableUsecase } from "../../usecase/commercial/price-table/create-one.price-table.usecase";
import { inactivatePriceTableUsecase } from "../../usecase/commercial/price-table/inactivate.price-table.usecase";
import { updateOnePriceTableUsecase } from "../../usecase/commercial/price-table/update-one.price-table.usecase";
import { cancelPriceTableUsecase } from "../../usecase/commercial/price-table/cancel.price-table.usecase";
import { validateBillingConditionsPriceTableUsecase } from "../../usecase/commercial/price-table/validate-billing-conditions.usecase";
import { publishPriceTableUsecase } from "../../usecase/commercial/price-table/publish.price-table.usecase";

export async function findManyPriceTable(
  filter: Filter<IPriceTable> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyPriceTableUsecase.execute({ filter, page, limit, sort });
}

export const findOnePriceTable = async (filter: Filter<IPriceTable>) => {
  const result = await findOnePriceTableUsecase.execute(filter);
  return result;
};

export async function createOnePriceTable(
  input: Omit<IPriceTable, "id" | "created_at" | "updated_at">
) {
  return await createOnePriceTableUsecase.execute(input);
}

export async function updateOnePriceTable(input: IPriceTable) {
  return await updateOnePriceTableUsecase.execute(input);
}

export const inactivatePriceTable = async (id: string) => {
  const result = await inactivatePriceTableUsecase.execute({ id });
  return result;
};

export const cancelPriceTable = async (id: string) => {
  const result = await cancelPriceTableUsecase.execute({ id });
  return result;
};

export const validateBillingConditionsPriceTable = async (
  groups: Array<IPriceTableConditionGroup & { priorityEnabled?: boolean }>
) => {
  return await validateBillingConditionsPriceTableUsecase.execute({ groups });
};

export const publishPriceTable = async (id: string) => {
  const result = await publishPriceTableUsecase.execute({ id });
  return result;
};
