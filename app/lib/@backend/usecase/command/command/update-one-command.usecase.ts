import { singleton } from "@/app/lib/util/singleton"
import { ICommand, ICommandRepository } from "@/app/lib/@backend/domain"
import { commandRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneCommandUsecase {
  repository: ICommandRepository

  constructor() {
    this.repository = commandRepository
  }

  async execute(
    query: { id: string },
    value: Omit<ICommand, "id" | "created_at">,
  ) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneCommandUsecase = singleton(UpdateOneCommandUsecase)
