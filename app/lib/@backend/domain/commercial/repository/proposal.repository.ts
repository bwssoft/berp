import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";

export interface IProposalRepository extends IBaseRepository<IProposal> { }
