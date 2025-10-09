"use server";

import { createOneMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/create-one.movement.usecase";
import { findOneMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/find-one.movement.usecase";
import { updateOneMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/update-one.movement.usecase";
import { findManyMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/find-many.movement.usecase";
import { createManyMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/create-many.movement.usecase";
import { confirmManyMovementUsecase } from "@/app/lib/@backend/usecase/logistic/movement/confirm-many.movement.usecase";
import { IMovement } from "@/app/lib/@backend/domain/logistic/entity/movement.entity";
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

export async function confirmManyMovement(input: string[]) {
  const result = await confirmManyMovementUsecase.execute(input);
  revalidatePath("/logistic/movement");
  revalidatePath("/logistic/stock");
  return result;
}
