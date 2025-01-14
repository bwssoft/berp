import { IInputRepository, IInput } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;

namespace Dto {
  export interface Input extends Partial<IInput> { }
  export type Output = IInput[]
}

class FindManyInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input) {
    const aggragate = await this.repository.aggregate<IInput>(this.pipeline(input));
    return (await aggragate.toArray()) as Dto.Output
  }

  pipeline(input: Partial<IInput>) {
    return [
      { $match: input },
      { $limit: 20 }
    ]
  }
}

export const findManyInputUsecase = singleton(FindManyInputUsecase);
