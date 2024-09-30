import { IProduct, IProductRepository } from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

class FindManyProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(input: Filter<IProduct>) {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as IProduct[];
  }

  pipeline(input: Filter<IProduct>) {
    return [{ $match: input }];
  }
}

export const findManyProductUsecase = singleton(FindManyProductUsecase);
