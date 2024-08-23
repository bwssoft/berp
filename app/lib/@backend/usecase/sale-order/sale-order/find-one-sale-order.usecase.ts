import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain";
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

class FindOneSaleOrderUsecase {
  repository: ISaleOrderRepository;

  constructor() {
    this.repository = saleOrderRepository;
  }

  async execute(input: Filter<ISaleOrder>) {
    return await this.repository.findOne(input);
  }
}

export const findOneSaleOrderUsecase = singleton(FindOneSaleOrderUsecase);
