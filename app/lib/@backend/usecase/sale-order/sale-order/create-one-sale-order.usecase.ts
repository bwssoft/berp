import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain";
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class CreateOneSaleOrderUsecase {
  repository: ISaleOrderRepository;

  constructor() {
    this.repository = saleOrderRepository;
  }

  async execute(input: Omit<ISaleOrder, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });
    return await this.repository.create(client);
  }
}

export const createOneSaleOrderUsecase = singleton(CreateOneSaleOrderUsecase);
