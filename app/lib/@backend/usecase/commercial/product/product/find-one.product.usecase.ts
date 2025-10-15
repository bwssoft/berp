import { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import { IProductRepository } from "@/backend/domain/commercial/repository/product.repository";
import { productRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";;

class FindOneProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IProduct>) {
    return await this.repository.findOne(input);
  }
}

export const findOneProductUsecase = singleton(FindOneProductUsecase);

