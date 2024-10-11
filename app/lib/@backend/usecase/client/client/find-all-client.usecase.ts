import { IClientRepository } from "@/app/lib/@backend/domain";
import { clientRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class FindAllClientUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllClientUsecase = singleton(FindAllClientUsecase);
