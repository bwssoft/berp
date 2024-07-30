import { singleton } from "@/app/lib/util/singleton"
import { IDevice, IDeviceRepository, IProduct } from "@/app/lib/@backend/domain"
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb"

class FindManyDeviceBySerialUsecase {
  repository: IDeviceRepository

  constructor() {
    this.repository = deviceRepository
  }

  async execute(serial: string[]) {
    const pipeline = this.pipeline(serial)
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as (IDevice & { product: IProduct })[]
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
        }
      },
      {
        $project: {
          id: 1,
          serial: 1,
          created_at: 1,
          product: { $first: "$product" },
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]
    return pipeline
  }
}

export const findManyDeviceBySerialUsecase = singleton(FindManyDeviceBySerialUsecase)
