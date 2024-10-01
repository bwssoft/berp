import {
  IInput,
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "../../decorators";

export type ITechnicalSheetWithInputs = ITechnicalSheet & {
  inputs_metadata: IInput[];
};

class FindManyTechnicalSheetWithInputsUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  @RemoveMongoId()
  async execute(
    params: Filter<ITechnicalSheet>
  ): Promise<ITechnicalSheetWithInputs[]> {
    const pipeline = this.pipeline(params);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as ITechnicalSheetWithInputs[];
  }

  pipeline(params: Filter<ITechnicalSheet>) {
    return [
      { $match: params },
      {
        $lookup: {
          from: "input",
          localField: "inputs.uuid",
          foreignField: "id",
          as: "inputs_metadata",
        },
      },
    ];
  }
}

export const findManyTechnicalSheetWithInputsUsecase = singleton(
  FindManyTechnicalSheetWithInputsUsecase
);
