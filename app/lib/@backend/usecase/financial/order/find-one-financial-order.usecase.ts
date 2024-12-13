import { IFinancialOrder, IFinancialOrderRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;
import { financialOrderRepository } from "@/app/lib/@backend/infra";

class FindOneFinancialOrderUsecase {
  repository: IFinancialOrderRepository;

  constructor() {
    this.repository = financialOrderRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IFinancialOrder>) {
    return await this.repository.findOne({ active: true, ...input });
  }
}

export const findOneFinancialOrderUsecase = singleton(FindOneFinancialOrderUsecase);
