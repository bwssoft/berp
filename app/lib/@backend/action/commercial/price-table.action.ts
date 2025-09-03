"use server";

import { Filter } from "mongodb";
import { IPriceTable } from "../../domain";
import { findManyPriceTableUsecase } from "../../usecase/commercial/price-table/find-many.price-table.usecase";
import { findOnePriceTableUsecase } from "../../usecase/commercial/price-table/find-one.price-table.usecase";
import { PaginationResult } from "../../domain/@shared/repository/pagination.interface";

export async function findManyAccount(
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

export async function findManySector(input: {
  filter?: Filter<IPriceTable>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}): Promise<PaginationResult<IPriceTable>> {
  return await findManyPriceTableUsecase.execute(input);
}