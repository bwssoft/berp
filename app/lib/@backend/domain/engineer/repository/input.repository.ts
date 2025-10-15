import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IInput } from "@/backend/domain/engineer/entity/input.definition";

export interface IInputRepository extends IBaseRepository<IInput> {}
