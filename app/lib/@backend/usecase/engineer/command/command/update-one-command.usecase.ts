import { singleton } from "@/app/lib/util/singleton";
import type { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import type { ICommandRepository } from "@/backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/backend/infra";

class UpdateOneCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<ICommand, "id" | "created_at">
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneCommandUsecase = singleton(UpdateOneCommandUsecase);

