"use server"
import { Filter } from "mongodb";
import { IHistorical } from "../../domain";
import { createOneHistoricalUsecase, findManyHistoricalUsecase } from "../../usecase";

export async function createOneHistorical(
  historical: Omit<IHistorical, "id" | "created_at">
) {
  return await createOneHistoricalUsecase.execute(historical);
}

export async function findManyHistorical(
  filter: Filter<IHistorical> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyHistoricalUsecase.execute({ filter, page, limit, sort });
}
