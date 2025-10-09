import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import { IProductRepository } from "@/backend/domain/commercial/repository/product.repository";
import { productRepository } from "@/backend/infra";

class DeleteOneProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(product: Partial<IProduct>) {
    return await this.repository.deleteOne(product);
  }
}

export const deleteOneProductUsecase = singleton(DeleteOneProductUsecase);

