"use server";

import { IControl } from "@/app/lib/@backend/domain";
import {
  countControlUsecase,
  findManyControlUsecase,
  findOneControlUsecase,
} from "../../usecase";
import { Filter } from "mongodb";

export async function findManyControl(input: Filter<IControl>, limit?: number) {
  return await findManyControlUsecase.execute(input, limit);
}

export async function findOneControl(input: Partial<IControl>) {
  return await findOneControlUsecase.execute(input);
}

export async function countControl(input: Filter<IControl>) {
  return await countControlUsecase.execute(input);
}
