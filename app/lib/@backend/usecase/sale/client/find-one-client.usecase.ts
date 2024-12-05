import { IClient, IClientRepository } from "@/app/lib/@backend/domain";
import { clientRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "../../../decorators";

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
