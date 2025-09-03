"use server";

import { Filter } from "mongodb";
import { IPriceTable } from "../../domain";
import { findManyPriceTableUsecase } from "../../usecase/commercial/price-table/find-many.price-table.usecase";

export async function findManyAccount(
    filter: Filter<IPriceTable> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    return await findManyPriceTableUsecase.execute({ filter, page, limit, sort });
}