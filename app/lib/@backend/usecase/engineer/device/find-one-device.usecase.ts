
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class FindOneDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IDevice>) {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);
    const [device] = await aggregate.toArray();
    return device as IDevice & { product: IProduct };
  }

  private pipeline(device: Partial<IDevice>) {
    return [
      { $match: device },
      {
        $lookup: {
          from: "product",
          as: "product",
          localField: "product_id",
          foreignField: "id",
        },
      },
      {
        $project: {
          id: 1,
          serial: 1,
          created_at: 1,
          product: { $first: "$product" },
        },
      },
    ];
  }
}

export const findOneDeviceUsecase = singleton(FindOneDeviceUsecase);
