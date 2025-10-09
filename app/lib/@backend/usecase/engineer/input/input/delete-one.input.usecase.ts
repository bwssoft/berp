import { singleton } from "@/app/lib/util/singleton";
import { IInput } from "@/app/lib/@backend/domain/engineer/entity/input.definition";
import { IInputRepository } from "@/app/lib/@backend/domain/engineer/repository/input.repository.interface";
import { inputRepository } from "@/app/lib/@backend/infra";

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
