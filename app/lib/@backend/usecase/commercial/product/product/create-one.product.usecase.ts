import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import { IProductRepository } from "@/app/lib/@backend/domain/commercial/repository/product.repository";
import { productRepository } from "@/app/lib/@backend/infra";

class CreateOneProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
  }

  async execute(product: Omit<IProduct, "id" | "created_at" | "seq" | "sku">) {
    try {
      const last_product_with_same_category = await this.repository.findOne(
        { "category.id": product.category.id },
        { sort: { seq: -1 }, limit: 1 }
      );
      const seq = (last_product_with_same_category?.seq ?? 0) + 1;
      const _product = Object.assign(product, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        seq,
        sku: `${product.category.code}-${seq}`,
      });

      await this.repository.create(_product);
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

export const createOneProductUsecase = singleton(CreateOneProductUsecase);
