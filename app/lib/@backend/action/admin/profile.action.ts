"use server";

import { IProfile } from "@/app/lib/@backend/domain";
import {
  createOneProfileUsecase,
  findManyProfileUsecase,
  findOneProfileUsecase,
} from "../../usecase";
import { Filter } from "mongodb";

export async function createOneProfile(
  input: Omit<IProfile, "id" | "created_at">
) {
  await createOneProfileUsecase.execute(input);
}

export async function findManyProfile(input: Filter<IProfile>) {
  return await findManyProfileUsecase.execute(input);
}

export async function findOneProfile(input: Filter<IProfile>) {
  return await findOneProfileUsecase.execute(input);
}
