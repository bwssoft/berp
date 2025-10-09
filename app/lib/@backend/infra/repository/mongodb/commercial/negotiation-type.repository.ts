import { INegotiationType } from "@/backend/domain/commercial/entity/negotiation-type.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class NegotiationTypeRepository extends BaseRepository<INegotiationType> {
  constructor() {
    super({
      collection: "commercial-negotiation-type",
      db: "berp"
    });
  }
}

export const negotiationTypeRepository = singleton(NegotiationTypeRepository)

