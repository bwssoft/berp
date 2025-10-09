"use server"

import { INegotiationType } from "@/app/lib/@backend/domain/commercial/entity/negotiation-type.definition";
import { findAllNegotiationTypeUsecase } from "@/app/lib/@backend/usecase/commercial/negotiation-type/find-all-opportunity.usecase"

export async function findAllNegotiationType(): Promise<INegotiationType[]> {
  return await findAllNegotiationTypeUsecase.execute()
}
