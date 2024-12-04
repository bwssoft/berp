"use server"

import { INegotiationType } from "../../domain"
import { findAllNegotiationTypeUsecase } from "../../usecase/client/negotiation-type"

export async function findAllNegotiationType(): Promise<INegotiationType[]> {
  return await findAllNegotiationTypeUsecase.execute()
}
