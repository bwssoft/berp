"use server"

import { INegotiationType } from "@/app/lib/@backend/domain"
import { findAllNegotiationTypeUsecase } from "@/app/lib/@backend/usecase"

export async function findAllNegotiationType(): Promise<INegotiationType[]> {
  return await findAllNegotiationTypeUsecase.execute()
}
