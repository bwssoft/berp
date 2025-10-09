"use server";

import { createOneBaseUsecase } from "@/app/lib/@backend/usecase/logistic/base/create-one.base.usecase";
import { findOneBaseUsecase } from "@/app/lib/@backend/usecase/logistic/base/find-one.base.usecase";
import { updateOneBaseUsecase } from "@/app/lib/@backend/usecase/logistic/base/update-one.base.usecase";
import { findManyBaseUsecase } from "@/app/lib/@backend/usecase/logistic/base/find-many.base.usecase";
import { IBase } from "@/app/lib/@backend/domain/logistic/entity/base.entity";
import { Filter } from "mongodb";

export async function createOneBase(input: Omit<IBase, "id" | "created_at">) {
  return await createOneBaseUsecase.execute(input);
}

export async function findOneBase(input: { filter: Partial<IBase> }) {
  return await findOneBaseUsecase.execute(input);
}

export async function findManyBase(input: {
  filter: Filter<IBase>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}) {
  return await findManyBaseUsecase.execute(input);
}

export async function updateOneBaseById(
  query: { id: string },
  value: Omit<IBase, "id" | "created_at">
) {
  return await updateOneBaseUsecase.execute(query, value);
}
