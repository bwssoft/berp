import {
  IDevice,
  IDeviceRepository,
  IProduct,
} from "@/app/lib/@backend/domain";
import { deviceRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

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

  pipeline(device: Partial<IDevice>) {
    const pipeline = [
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
    return pipeline;
  }
}

export const findOneDeviceUsecase = singleton(FindOneDeviceUsecase);
