import IDevice from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import { deviceRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
    return pipeline;
  }
}

export const findAllDeviceUsecase = singleton(FindAllDeviceUsecase);
