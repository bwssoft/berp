"use server";

import { createOneItemUsecase } from "@/backend/usecase/logistic/item/create-one.item.usecase";
import { findOneItemUsecase } from "@/backend/usecase/logistic/item/find-one.item.usecase";
import { updateOneItemUsecase } from "@/backend/usecase/logistic/item/update-one.item.usecase";
import { findManyItemUsecase } from "@/backend/usecase/logistic/item/find-many.item.usecase";
import { IItem } from "@/backend/domain/logistic/entity/item.entity";
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

