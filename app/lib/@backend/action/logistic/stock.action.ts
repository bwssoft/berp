"use server";

import {
  createOneStockUsecase,
  findOneStockUsecase,
  updateOneStockUsecase,
  findManyStockUsecase,
} from "@/app/lib/@backend/usecase";
import { IStock } from "@/app/lib/@backend/domain";
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
