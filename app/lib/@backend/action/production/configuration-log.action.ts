"use server";

import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { createOneConfigurationLogUsecase } from "@/app/lib/@backend/usecase";
import { revalidatePath } from "next/cache";

export async function createOneConfigurationLog(
  configurationLog: Omit<IConfigurationLog, "id" | "created_at">
) {
  await createOneConfigurationLogUsecase.execute(configurationLog);
  revalidatePath("/production/configuration-log");
}
