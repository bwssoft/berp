"use server"

import { INegotiationType } from "@/backend/domain/commercial/entity/negotiation-type.definition";
import { findAllNegotiationTypeUsecase } from "@/backend/usecase/commercial/negotiation-type/find-all-opportunity.usecase"

export async function findAllNegotiationType(): Promise<INegotiationType[]> {
  return await findAllNegotiationTypeUsecase.execute()
}

