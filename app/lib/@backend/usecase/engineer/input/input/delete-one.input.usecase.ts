import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
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
