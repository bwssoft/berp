import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IInput, IInputTransaction } from "../entity";

export interface IInputTransactionRepository extends IBaseRepository<IInputTransaction> {
  findAllWithInput(): Promise<(IInputTransaction & { input: IInput })[]>
}