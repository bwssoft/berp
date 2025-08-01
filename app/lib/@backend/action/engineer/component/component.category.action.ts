"use server";

import { revalidatePath } from "next/cache";
import {
  createManyComponentCategoryUsecase,
  createOneComponentCategoryUsecase,
  deleteOneComponentCategoryUsecase,
  findManyComponentCategoryUsecase,
} from "@/app/lib/@backend/usecase";
import { IComponentCategory } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";

export async function findManyComponentCategory(input: {
  filter: Filter<IComponentCategory>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyComponentCategoryUsecase.execute(input);
}

export async function createOneComponentCategory(
  componentCategory: Omit<IComponentCategory, "id" | "created_at">
) {
  const result =
    await createOneComponentCategoryUsecase.execute(componentCategory);
  revalidatePath("/engineer/component");
  revalidatePath("/engineer/component/category");
  return result;
}

export async function createManyComponentInputCategories(
  componentCategory: Omit<IComponentCategory, "id" | "created_at">[]
) {
  await createManyComponentCategoryUsecase.execute(componentCategory);
  revalidatePath("/engineer/component");
  revalidatePath("/engineer/component/category");
  return componentCategory;
}

export async function deleteOneComponentCategoryById(params: { id: string }) {
  await deleteOneComponentCategoryUsecase.execute(params);
  revalidatePath("/engineer/component");
}
