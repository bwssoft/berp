import { singleton } from "@/app/lib/util/singleton"
import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { IClientRepository } from "@/backend/domain/commercial/repository/client.repository";
import { clientRepository } from "@/backend/infra"

class CreateOneClientUsecase {
  repository: IClientRepository

  constructor() {
    this.repository = clientRepository
  }

  async execute(input: Omit<IClient, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(client)
  }
}

export const createOneClientUsecase = singleton(CreateOneClientUsecase)

