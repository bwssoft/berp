import { singleton } from "@/app/lib/util/singleton"
import { ICommand, IDevice, IFirmware, ISchedule, IScheduleRepository } from "@/app/lib/@backend/domain"
import { scheduleRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllScheduleUsecase {
  repository: IScheduleRepository

  constructor() {
    this.repository = scheduleRepository
  }

  async execute() {
    const pipeline = this.pipeline()
    const aggregate = await this.repository.aggregate(pipeline)
    return await aggregate.toArray() as (ISchedule & { device: IDevice, command: ICommand, firmware?: IFirmware })[]
  }

  pipeline() {
    const pipeline = [
      { $match: {} },
      {
        $lookup: {
          from: "device",
          as: "device",
          localField: "device_id",
          foreignField: "id"
        }
      },
      {
        $lookup: {
          from: "command",
          as: "command",
          localField: "command_id",
          foreignField: "id"
        }
      },
      {
        $lookup: {
          from: "firmware",
          as: "firmware",
          localField: "firmware_id",
          foreignField: "id"
        }
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
          response_timestamp: 1,
        }
      }
    ]
    return pipeline
  }
}

export const findAllScheduleUsecase = singleton(FindAllScheduleUsecase)
