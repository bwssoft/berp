"use server";

import { ITechnology } from "../../domain";
import { findManyTechnologyUsecase } from "../../usecase";

export async function findManyTechnology(): Promise<ITechnology[]> {
  return await findManyTechnologyUsecase.execute();
}
