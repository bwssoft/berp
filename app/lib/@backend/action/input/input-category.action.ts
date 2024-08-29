"use server";

import { revalidatePath } from "next/cache";
import { createManyCategoryUsecase } from "../../usecase/input/category/create-many-category.usecase";
import { IInputCategory } from "../../domain/input/entity/input-category.definition";

export async function createManyInputCategories(input: Omit<IInputCategory, "id" | "created_at">[]) {
  await createManyCategoryUsecase.execute(input);
  revalidatePath("/input")
  return input;
}