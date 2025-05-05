import { IProduct, IProductRepository } from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindManyProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IProduct>) {
    const { docs } = await this.repository.findMany(input)
    return docs
  }
}

export const findManyProductUsecase = singleton(FindManyProductUsecase);
