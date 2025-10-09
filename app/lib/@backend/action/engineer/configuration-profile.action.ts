"use server";

import { revalidatePath } from "next/cache";
import { createOneConfigurationProfileUsecase } from "@/app/lib/@backend/usecase/engineer/configuration-profile/create-one-configuration-profile.usecase";
import { deleteOneConfigurationProfileUsecase } from "@/app/lib/@backend/usecase/engineer/configuration-profile/delete-one-configuration-profile.usecase";
import { findManyConfigurationProfileUsecase } from "@/app/lib/@backend/usecase/engineer/configuration-profile/find-many-configuration-profile.usecase";
import { findOneConfigurationProfileUsecase } from "@/app/lib/@backend/usecase/engineer/configuration-profile/find-one-configuration-profile.usecase";
import { updateOneConfigurationProfileUsecase } from "@/app/lib/@backend/usecase/engineer/configuration-profile/update-one-configuration-profile.usecase";
import { IConfigurationProfile } from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import { Filter } from "mongodb";
import { statsConfigurationProfileUsecase } from "../../usecase/engineer/configuration-profile/stats-configuration-profile.usecase";

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

export async function statsConfigurationProfile() {
  return await statsConfigurationProfileUsecase.execute();
}
