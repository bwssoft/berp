"use server";

import { revalidatePath } from "next/cache";
import {
  createOneConfigurationProfileUsecase,
  deleteOneConfigurationProfileUsecase,
  findManyConfigurationProfileUsecase,
  findOneConfigurationProfileUsecase,
  updateOneConfigurationProfileUsecase,
} from "@/app/lib/@backend/usecase";
import { IConfigurationProfile } from "@/app/lib/@backend/domain";
import { Filter } from "mongodb";

export async function createOneConfigurationProfile(
  input: Omit<
    IConfigurationProfile,
    "id" | "created_at" | "user_id" | "validation"
  >
) {
  const result = await createOneConfigurationProfileUsecase.execute(input);
  revalidatePath("/engineer/configuration-profile");
  return result;
}

export async function updateOneConfigurationProfileById(
  query: { id: string },
  value: Omit<
    IConfigurationProfile,
    "id" | "created_at" | "user_id" | "validation"
  >
) {
  await updateOneConfigurationProfileUsecase.execute(query, value);
  revalidatePath("/engineer/configuration-profile");
  revalidatePath("/crm/configuration-profile");
}

export async function deleteOneConfigurationProfileById(query: { id: string }) {
  await deleteOneConfigurationProfileUsecase.execute(query);
  revalidatePath("/engineer/configuration-profile");
  revalidatePath("/crm/configuration-profile");
}

export async function findManyConfigurationProfile(
  query: Filter<IConfigurationProfile>
) {
  return await findManyConfigurationProfileUsecase.execute(query);
}

export async function findOneConfigurationProfile(
  query: Partial<IConfigurationProfile>
) {
  return await findOneConfigurationProfileUsecase.execute(query);
}
