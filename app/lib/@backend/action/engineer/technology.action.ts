"use server";

import { Filter } from "mongodb";
import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { findManyTechnologyUsecase } from "../../usecase/engineer/technology/find-many-technology.usecase";
import { findOneTechnologyUsecase } from "../../usecase/engineer/technology/find-one-technology.usecase";

export async function findManyTechnology(
  input: Filter<ITechnology>
): Promise<ITechnology[]> {
  return await findManyTechnologyUsecase.execute(input);
}

export async function findOneTechnology(
  input: Partial<ITechnology>
): Promise<ITechnology | null> {
  return await findOneTechnologyUsecase.execute(input);
}
