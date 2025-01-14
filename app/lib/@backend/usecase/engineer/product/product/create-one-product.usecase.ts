import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/infra"

class CreateOneProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute(input: Omit<IProduct, "id" | "created_at" | "code">) {
    const last_product = await this.repository.findOne({}, { sort: { code: -1 }, limit: 1 })

    const product = Object.assign(
      input,
      {
        created_at: new Date(),
        id: crypto.randomUUID(),
        code: (last_product?.code ?? 0) + 1
      }
    )
    await this.repository.create(product)
    return product
  }
}

export const createOneProductUsecase = singleton(CreateOneProductUsecase)
