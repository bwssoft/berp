import { singleton } from "@/app/lib/util/singleton";
import { IInput } from "@/backend/domain/engineer/entity/input.definition";
import { IInputRepository } from "@/backend/domain/engineer/repository/input.repository";
import { inputRepository } from "@/backend/infra";

class DeleteOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(Input: Partial<IInput>) {
    return await this.repository.deleteOne(Input);
  }
}

export const deleteOneInputUsecase = singleton(DeleteOneInputUsecase);

