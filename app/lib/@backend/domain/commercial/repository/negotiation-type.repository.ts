import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { INegotiationType } from "@/backend/domain/commercial/entity/negotiation-type.definition";

export interface INegotiationTypeRepository extends IBaseRepository<INegotiationType> { }
