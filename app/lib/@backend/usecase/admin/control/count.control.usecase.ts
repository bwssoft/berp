import { singleton } from "@/app/lib/util/singleton";
import { IControl, IControlRepository } from "@/app/lib/@backend/domain";
import { controlRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";

class CountControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  async execute(input: Filter<IControl>) {
    return await this.repository.count(input);
  }
}

export const countControlUsecase = singleton(CountControlUsecase);
