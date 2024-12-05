import { ICommand, ICommandRepository } from "@/app/lib/@backend/domain";
import { commandRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindOneCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<ICommand>) {
    return await this.repository.findOne(args);
  }
}

export const findOneCommandUsecase = singleton(FindOneCommandUsecase);
