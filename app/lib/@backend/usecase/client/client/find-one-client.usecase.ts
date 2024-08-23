import { IClient, IClientRepository } from "@/app/lib/@backend/domain";
import { clientRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

class FindOneClientUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  async execute(input: Filter<IClient>) {
    return await this.repository.findOne(input);
  }
}

export const findOneClientUsecase = singleton(FindOneClientUsecase);
