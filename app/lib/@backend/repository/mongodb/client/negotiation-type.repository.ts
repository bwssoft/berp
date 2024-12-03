import { INegotiationType } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";
import { singleton } from "@/app/lib/util/singleton";

class NegotiationTypeRepository extends BaseRepository<INegotiationType> {
  constructor() {
    super({
      collection: "sale-negotiation-type",
      db: "berp"
    });
  }
}

export const negotiationTypeRepository = singleton(NegotiationTypeRepository)
