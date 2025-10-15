import { singleton } from "@/app/lib/util/singleton";
import type { IControl } from "@/backend/domain/admin/entity/control.definition";
import type { IControlRepository } from "@/backend/domain/admin/repository/control.repository.interface";
import { controlRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

class CountControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  async execute(input: Filter<IControl>) {
    return this.repository.count(input);
  }
}

export const countControlUsecase = singleton(CountControlUsecase);
