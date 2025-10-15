import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ICommand } from "@/backend/domain/engineer/entity/command.definition";

export interface ICommandRepository extends IBaseRepository<ICommand> { }
