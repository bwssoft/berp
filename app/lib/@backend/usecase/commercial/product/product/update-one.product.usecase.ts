import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import { IProductRepository } from "@/backend/domain/commercial/repository/product.repository";
import { productRepository } from "@/backend/infra";

class UpdateOneProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IProduct, "id" | "created_at" | "seq" | "sku">
  ) {
    try {
      await this.repository.updateOne(query, { $set: value });
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          usecase: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const updateOneProductUsecase = singleton(UpdateOneProductUsecase);

