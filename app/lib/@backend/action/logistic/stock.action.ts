"use server";

import { createOneStockUsecase } from "@/app/lib/@backend/usecase/logistic/stock/create-one.stock.usecase";
import { findOneStockUsecase } from "@/app/lib/@backend/usecase/logistic/stock/find-one.stock.usecase";
import { updateOneStockUsecase } from "@/app/lib/@backend/usecase/logistic/stock/update-one.stock.usecase";
import { findManyStockUsecase } from "@/app/lib/@backend/usecase/logistic/stock/find-many.stock.usecase";
import { IStock } from "@/app/lib/@backend/domain/logistic/entity/stock.entity";
import { Filter } from "mongodb";

export async function createOneStock(input: Omit<IStock, "id" | "created_at">) {
  await createOneStockUsecase.execute(input);
}

export async function findOneStock(input: { filter: Partial<IStock> }) {
  return await findOneStockUsecase.execute(input);
}

export async function findManyStock(input: {
  filter: Filter<IStock>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyStockUsecase.execute(input);
}

export async function updateOneStockById(
  query: { id: string },
  value: Omit<IStock, "id" | "created_at">
) {
  await updateOneStockUsecase.execute(query, value);
}
