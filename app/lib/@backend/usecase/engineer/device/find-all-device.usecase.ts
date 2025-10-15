
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class FindAllDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  @RemoveMongoId()
  async execute() {
    const pipeline = this.pipeline();
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as (IDevice & { product: IProduct })[];
  }

  private pipeline() {
    return [
      { $match: {} },
      { $limit: 20 },
      {
        $project: {
          id: 1,
          equipment: 1,
          model: 1,
          created_at: 1,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
  }
}

export const findAllDeviceUsecase = singleton(FindAllDeviceUsecase);
