import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";

export interface ITechnologyRepository extends IBaseRepository<ITechnology> { }
