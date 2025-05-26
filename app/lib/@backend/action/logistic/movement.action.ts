"use server";

import {
  createOneMovementUsecase,
  findOneMovementUsecase,
  updateOneMovementUsecase,
  findManyMovementUsecase,
  createManyMovementUsecase,
} from "@/app/lib/@backend/usecase";
import { IMovement } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneMovement(
  input: Omit<IMovement, "id" | "created_at">
) {
  const result = await createOneMovementUsecase.execute(input);
  revalidatePath("/logistic/movement");
  return result;
}

export async function createManyMovement(
  input: Omit<IMovement, "created_at" | "seq">[]
) {
  const result = await createManyMovementUsecase.execute(input);
  revalidatePath("/logistic/movement");
  return result;
}

export async function findOneMovement(input: { filter: Partial<IMovement> }) {
  return await findOneMovementUsecase.execute(input);
}

export async function findManyMovement(input: {
  filter: Filter<IMovement>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyMovementUsecase.execute(input);
}

export async function updateOneMovementById(
  query: { id: string },
  value: Omit<IMovement, "id" | "created_at">
) {
  const result = await updateOneMovementUsecase.execute(query, value);
  revalidatePath("/logistic/movement");
  return result;
}
