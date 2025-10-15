import { singleton } from "@/app/lib/util/singleton";
import type { IProductCategory } from "@/backend/domain/commercial/entity/product.category.definition";
import type { IProductCategoryRepository } from "@/backend/domain/commercial";
import { productCategoryRepository } from "@/backend/infra";

class CreateOneProductCategoryUsecase {
  repository: IProductCategoryRepository;

  constructor() {
    this.repository = productCategoryRepository;
  }

  async execute(
    productCategory: Omit<IProductCategory, "id" | "created_at" | "seq">
  ) {
    try {
      const _productCategory = Object.assign(productCategory, {
        created_at: new Date(),
        id: crypto.randomUUID(),
      });

      await this.repository.create(_productCategory);
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

export const createOneProductCategoryUsecase = singleton(
  CreateOneProductCategoryUsecase
);

