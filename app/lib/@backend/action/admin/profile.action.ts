"use server";

import { IProfile } from "@/app/lib/@backend/domain";
import {
  activeProfileUsecase,
  createOneProfileUsecase,
  findManyProfileUsecase,
  findOneProfileUsecase,
  setLockedControlProfileUsecase,
} from "../../usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneProfile(
  input: Omit<IProfile, "id" | "created_at">
) {
  const result = await createOneProfileUsecase.execute(input);
  revalidatePath("/admin/profile");
  return result;
}

export async function findManyProfile(
  filter: Filter<IProfile>,
  sort?: Record<string, 1 | -1>
) {
  return await findManyProfileUsecase.execute({ filter, sort });
}

export async function findOneProfile(input: Filter<IProfile>) {
  return await findOneProfileUsecase.execute(input);
}

export async function setLockedControl(input: {
  id: string;
  locked_control_code: string[];
  operation: "add" | "remove";
  control_name: string;
}) {
  await setLockedControlProfileUsecase.execute(input);
  revalidatePath("/admin/control");
}

export async function activeProfile(input: { id: string; active: boolean }) {
  const result = await activeProfileUsecase.execute(input);
  revalidatePath("/admin/profile");
  revalidatePath("/admin/control");
  return result;
}
