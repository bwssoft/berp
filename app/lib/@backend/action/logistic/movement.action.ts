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

export async function createOneMovement(
  input: Omit<IMovement, "id" | "created_at">
) {
  await createOneMovementUsecase.execute(input);
}

export async function createManyMovement(
  input: Omit<IMovement, "id" | "created_at" | "seq">[]
) {
  return await createManyMovementUsecase.execute(input);
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
  await updateOneMovementUsecase.execute(query, value);
}
