import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { ICommand } from "../entity";

export interface ICommandRepository extends IBaseRepository<ICommand> { }