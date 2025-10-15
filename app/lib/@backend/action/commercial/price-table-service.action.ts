"use server";

import { Filter } from "mongodb";
import { IPriceTableService } from "@/backend/domain/commercial/entity/price-table-service.definition";
import { findManyPriceTableServiceUsecase } from "../../usecase/commercial/price-table-service/find-many.price-table-service.usecase";
import { createOnePriceTableServiceUsecase } from "../../usecase/commercial/price-table-service/create-one.price-table-service.usecase";
import { deleteOnePriceTableServiceUsecase } from "../../usecase/commercial/price-table-service/delete-one.price-table-service.usecase";

export async function findManyPriceTableService(
  filter: Filter<IPriceTableService> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyPriceTableServiceUsecase.execute({
    filter,
    page,
    limit,
    sort,
  });
}

export async function createOnePriceTableService(
  input: Omit<IPriceTableService, "id" | "created_at" | "updated_at">
) {
  return await createOnePriceTableServiceUsecase.execute(input);
}

export const deletePriceTableService = async (id: string) => {
  const result = await deleteOnePriceTableServiceUsecase.execute(id);
  return result;
};
