
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IDeviceRepository } from "@/backend/domain/engineer/repository/device.repository.interface";
import { deviceRepository } from "@/backend/infra";

class FindManyDeviceBySerialUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  @RemoveMongoId()
  async execute(serial: string[]) {
    const pipeline = this.pipeline(serial);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as (IDevice & { product: IProduct })[];
  }

  private pipeline(serial: string[]) {
    return [
      { $match: { serial: { $in: serial } } },
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
      {
        $sort: {
          _id: -1,
        },
      },
    ];
  }
}

export const findManyDeviceBySerialUsecase = singleton(
  FindManyDeviceBySerialUsecase
);
