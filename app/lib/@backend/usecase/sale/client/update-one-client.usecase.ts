import { singleton } from "@/app/lib/util/singleton"
import { IClient, IClientRepository } from "@/app/lib/@backend/domain"
import { clientRepository } from "@/app/lib/@backend/infra"

class UpdateOneClientUsecase {
  repository: IClientRepository

  constructor() {
    this.repository = clientRepository
  }

  async execute(query: { id: string }, value: Omit<IClient, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneClientUsecase = singleton(UpdateOneClientUsecase)
