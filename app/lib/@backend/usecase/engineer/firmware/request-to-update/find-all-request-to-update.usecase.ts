import IDevice from "@/app/lib/@backend/domain/engineer/entity/device.definition";
import IRequestToUpdate from "@/app/lib/@backend/domain/engineer/entity/request-to-update-firmware.definition";
import { requestToUpdateRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class FindAllRequestToUpdateUsecase {
  repository: IRequestToUpdateRepository;

  constructor() {
    this.repository = requestToUpdateRepository;
  }

  async execute() {
    const pipeline = this.pipeline();
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as (IRequestToUpdate & {
      device: IDevice;
      firmware: IFirmware;
    })[];
  }

  pipeline() {
    const pipeline = [
      {
        $lookup: {
          from: "device",
          as: "device",
          localField: "device_id",
          foreignField: "id",
        },
      },
      {
        $lookup: {
          from: "firmware",
          as: "firmware",
          localField: "firmware_id",
          foreignField: "id",
        },
      },
      {
        $match: {
          device: { $not: { $size: 0 } },
          firmware: { $not: { $size: 0 } },
        },
      },
      {
        $project: {
          device: { $first: "$device" },
          firmware: { $first: "$firmware" },
          created_at: 1,
          id: 1,
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

export const findAllRequestToUpdateUsecase = singleton(
  FindAllRequestToUpdateUsecase
);
