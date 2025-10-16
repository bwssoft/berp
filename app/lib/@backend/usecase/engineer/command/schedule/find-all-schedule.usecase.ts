import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import type { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import type { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import type { ISchedule } from "@/backend/domain/engineer/entity/command-schedule.definition";
import type { IScheduleRepository } from "@/backend/domain/engineer/repository/command-schedule.repository.interface";
import { scheduleRepository } from "@/backend/infra";

class FindAllScheduleUsecase {
  repository: IScheduleRepository;

  constructor() {
    this.repository = scheduleRepository;
  }

  @RemoveMongoId()
  async execute() {
    const pipeline = this.pipeline();
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as (ISchedule & {
      device: IDevice;
      command: ICommand;
      firmware?: IFirmware;
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
          from: "command",
          as: "command",
          localField: "command_id",
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
          command: { $not: { $size: 0 } },
        },
      },
      {
        $project: {
          device: { $first: "$device" },
          firmware: { $first: "$firmware" },
          command: { $first: "$command" },
          created_at: 1,
          id: 1,
          data: 1,
          pending: 1,
          request_timestamp: 1,
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

export const findAllScheduleUsecase = singleton(FindAllScheduleUsecase);

