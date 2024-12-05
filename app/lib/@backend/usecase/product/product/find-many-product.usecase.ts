import { IProduct, IProductRepository } from "@/app/lib/@backend/domain";
import { productRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "../../../decorators";

class FindManyProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  @RemoveMongoId()
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
