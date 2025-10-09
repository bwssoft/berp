"use server";
import { Filter } from "mongodb";
import { IHistorical } from "../../domain";
import { createOneHistoricalUsecase } from "../../usecase/commercial/historical/create-one.historical.usecase";
import { findManyHistoricalUsecase } from "../../usecase/commercial/historical/find-many.historical.usecase";
import { revalidatePath } from "next/cache";

export async function createOneHistorical(
    historical: Omit<IHistorical, "id" | "created_at">
) {
    const result = await createOneHistoricalUsecase.execute(historical);
    revalidatePath(`/commercial/account/management/historical?id={$accountId}`);

    return result;
}

export async function findManyHistorical(
    filter: Filter<IHistorical> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    return await findManyHistoricalUsecase.execute({
        filter,
        page,
        limit,
        sort: sort ?? { created_at: -1 }
    });
}
