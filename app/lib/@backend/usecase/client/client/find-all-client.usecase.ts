import { IClientRepository } from "@/app/lib/@backend/domain";
import { clientRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllClientUsecase {
  repository: IClientRepository;

  constructor() {
    this.repository = clientRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllClientUsecase = singleton(FindAllClientUsecase);
