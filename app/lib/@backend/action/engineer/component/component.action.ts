"use server";

import { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import { createManyComponentUsecase } from "@/backend/usecase/engineer/component/component/create-many.component.usecase";
import { createOneComponentUsecase } from "@/backend/usecase/engineer/component/component/create-one.component.usecase";
import { deleteOneComponentUsecase } from "@/backend/usecase/engineer/component/component/delete-one.component.usecase";
import { findManyComponentUsecase } from "@/backend/usecase/engineer/component/component/find-many.component.usecase";
import { findOneComponentUsecase } from "@/backend/usecase/engineer/component/component/find-one.component.usecase";
import { updateOneComponentUsecase } from "@/backend/usecase/engineer/component/component/update-one.component.usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneComponent(
  component: Omit<IComponent, "id" | "created_at" | "seq" | "sku">
) {
  const result = await createOneComponentUsecase.execute(component);
  revalidatePath("/engineer/component");
  return result;
}

export async function createManyComponent(
  component: Omit<IComponent, "id" | "created_at" | "seq" | "sku">[]
) {
  await createManyComponentUsecase.execute(component);
  revalidatePath("/engineer/component");
  return component;
}

export async function findOneComponent(component: Partial<IComponent>) {
  return await findOneComponentUsecase.execute(component);
}

export async function updateOneComponentById(
  query: { id: string },
  value: Omit<IComponent, "id" | "created_at" | "seq" | "sku">
) {
  const result = await updateOneComponentUsecase.execute(query, value);
  revalidatePath("/engineer/component");
  return result;
}

export async function deleteOneComponentById(query: { id: string }) {
  await deleteOneComponentUsecase.execute(query);
  revalidatePath("/engineer/component");
}

export async function findManyComponent(input: {
  filter: Filter<IComponent>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyComponentUsecase.execute(input);
}

