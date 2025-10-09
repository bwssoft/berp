import { IInput } from "@/app/lib/@backend/domain/engineer/entity/input.definition";
import { IInputRepository } from "@/app/lib/@backend/domain/engineer/repository/input.repository.interface";
import { inputRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IInput>) {
    return await this.repository.findOne(input);
  }
}

export const findOneInputUsecase = singleton(FindOneInputUsecase);
