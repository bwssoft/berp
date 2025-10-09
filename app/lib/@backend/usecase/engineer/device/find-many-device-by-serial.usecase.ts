import IDevice from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { deviceRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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

  pipeline(serial: string[]) {
    const pipeline = [
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
    return pipeline;
  }
}

export const findManyDeviceBySerialUsecase = singleton(
  FindManyDeviceBySerialUsecase
);
