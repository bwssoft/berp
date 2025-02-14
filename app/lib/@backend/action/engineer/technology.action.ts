"use server";

import { ITechnology } from "../../domain";
import {
  findManyTechnologyUsecase,
  findOneTechnologyUsecase,
} from "../../usecase";

export async function findManyTechnology(): Promise<ITechnology[]> {
  return await findManyTechnologyUsecase.execute();
}

export async function findOneTechnology(
  input: Partial<ITechnology>
): Promise<ITechnology | null> {
  return await findOneTechnologyUsecase.execute(input);
}
