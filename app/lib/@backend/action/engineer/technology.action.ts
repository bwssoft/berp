"use server";

import { Filter } from "mongodb";
import { ITechnology } from "../../domain";
import {
  findManyTechnologyUsecase,
  findOneTechnologyUsecase,
} from "../../usecase";

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
