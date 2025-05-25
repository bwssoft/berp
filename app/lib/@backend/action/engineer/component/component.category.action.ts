"use server";

import { revalidatePath } from "next/cache";
import {
  createManyComponentCategoryUsecase,
  createOneComponentCategoryUsecase,
  deleteOneComponentCategoryUsecase,
  findManyComponentCategoryUseCase,
} from "@/app/lib/@backend/usecase";
import { IComponentCategory } from "@/app/lib/@backend/domain";

export async function findManyComponentCategory(): Promise<
  IComponentCategory[]
> {
  return await findManyComponentCategoryUseCase.execute();
}

export async function createOneComponentCategory(
  componentCategory: Omit<IComponentCategory, "id" | "created_at">
) {
  await createOneComponentCategoryUsecase.execute(componentCategory);
  revalidatePath("/engineer/component");
  return componentCategory;
}

export async function createManyComponentInputCategories(
  componentCategory: Omit<IComponentCategory, "id" | "created_at">[]
) {
  await createManyComponentCategoryUsecase.execute(componentCategory);
  revalidatePath("/engineer/component");
  return componentCategory;
}

export async function deleteOneComponentCategoryById(params: { id: string }) {
  await deleteOneComponentCategoryUsecase.execute(params);
  revalidatePath("/engineer/component");
}
