"use server";

import { IControl } from "@/app/lib/@backend/domain";
import { findManyControlUsecase, findOneControlUsecase } from "../../usecase";
import { Filter } from "mongodb";

export async function findManyControl(input: Filter<IControl>) {
  return await findManyControlUsecase.execute(input);
}

export async function findOneControl(input: Partial<IControl>) {
  return await findOneControlUsecase.execute(input);
}
