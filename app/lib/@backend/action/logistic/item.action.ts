"use server";

import {
  createOneItemUsecase,
  findOneItemUsecase,
  updateOneItemUsecase,
  findManyItemUsecase,
} from "@/app/lib/@backend/usecase";
import { IItem } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";

export async function createOneItem(input: Omit<IItem, "id" | "created_at">) {
  return await createOneItemUsecase.execute(input);
}

export async function findOneItem(input: { filter: Partial<IItem> }) {
  return await findOneItemUsecase.execute(input);
}

export async function findManyItem(input: {
  filter: Filter<IItem>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyItemUsecase.execute(input);
}

export async function updateOneItemById(
  query: { id: string },
  value: Omit<IItem, "id" | "created_at">
) {
  await updateOneItemUsecase.execute(query, value);
}
