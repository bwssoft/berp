"use server";

import { IIdentification } from "@/app/lib/@backend/domain";
import { findOneIdentificationUsecase } from "@/app/lib/@backend/usecase";

export async function findOneIdentification(input: Partial<IIdentification>) {
  return await findOneIdentificationUsecase.execute(input);
}
