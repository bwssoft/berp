import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;
import { saleOrderRepository } from "@/app/lib/@backend/infra";

class FindOneSaleOrderUsecase {
  repository: ISaleOrderRepository;

  constructor() {
    this.repository = saleOrderRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<ISaleOrder>) {
    return await this.repository.findOne({ active: true, ...input });
  }
}

export const findOneSaleOrderUsecase = singleton(FindOneSaleOrderUsecase);
