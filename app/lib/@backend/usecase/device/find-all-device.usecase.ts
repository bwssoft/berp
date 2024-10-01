import {
  IDevice,
  IDeviceRepository,
  IProduct,
} from "@/app/lib/@backend/domain";
import { deviceRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

class FindAllDeviceUsecase {
  repository: IDeviceRepository;

  constructor() {
    this.repository = deviceRepository;
  }

  @RemoveMongoId()
  async execute() {
    const pipeline = this.pipeline();
    const aggragate = await this.repository.aggregate(pipeline);
    return (await aggragate.toArray()) as (IDevice & { product: IProduct })[];
  }

  pipeline() {
    const pipeline = [
      { $match: {} },
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

export const findAllDeviceUsecase = singleton(FindAllDeviceUsecase);
