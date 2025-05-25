"use server";

import { IComponent } from "@/app/lib/@backend/domain";
import {
  createManyComponentUsecase,
  createOneComponentUsecase,
  deleteOneComponentUsecase,
  findManyComponentUsecase,
  findOneComponentUsecase,
  updateOneComponentUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneComponent(
  component: Omit<IComponent, "id" | "created_at" | "seq">
) {
  const result = await createOneComponentUsecase.execute(component);
  revalidatePath("/engineer/component");
  return result;
}

export async function createManyComponent(
  component: Omit<IComponent, "id" | "created_at" | "code">[]
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
  value: Omit<IComponent, "id" | "created_at" | "code">
) {
  await updateOneComponentUsecase.execute(query, value);
  revalidatePath("/engineer/component");
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
