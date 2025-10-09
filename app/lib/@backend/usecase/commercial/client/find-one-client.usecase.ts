import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { IClientRepository } from "@/backend/domain/commercial/repository/client.repository";
import { clientRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";;

class FindOneClientUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IClient>) {
    return await this.repository.findOne(input);
  }
}

export const findOneClientUsecase = singleton(FindOneClientUsecase);

