"use server"

import { INegotiationType } from "../../domain"
import { findAllNegotiationTypeUsecase } from "../../usecase"

export async function findAllNegotiationType(): Promise<INegotiationType[]> {
  return await findAllNegotiationTypeUsecase.execute()
}
