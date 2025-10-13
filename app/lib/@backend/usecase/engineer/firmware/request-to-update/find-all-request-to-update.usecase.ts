import { singleton } from "@/app/lib/util/singleton";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import type { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";
import type { IRequestToUpdateRepository } from "@/backend/domain/engineer/repository/request-to-update-firmware.repository";
import { requestToUpdateRepository } from "@/backend/infra";

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

  private pipeline() {
    return [
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
  }
}

export const findAllRequestToUpdateUsecase = singleton(
  FindAllRequestToUpdateUsecase
);
