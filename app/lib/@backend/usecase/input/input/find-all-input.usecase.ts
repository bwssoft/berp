import { IInputRepository } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllInputUsecase = singleton(FindAllInputUsecase);
