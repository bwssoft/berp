import { IProduct, IProductRepository } from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "../../../decorators";

class FindAllProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  @RemoveMongoId()
  async execute(params: Filter<IProduct> = {}) {
    return await this.repository.findAll(params);
  }
}

export const findAllProductUsecase = singleton(FindAllProductUsecase);
