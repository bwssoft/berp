import {
  IInput,
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { Filter } from "mongodb";

export type ITechnicalSheetWithInputs = ITechnicalSheet & {
  inputs_metadata: IInput[];
};

class FindManyTechnicalSheetWithInputsUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(
    input: Filter<ITechnicalSheet>
  ): Promise<ITechnicalSheetWithInputs[]> {
    const pipeline = this.pipeline(input);
    const aggregate = await this.repository.aggregate(pipeline);
    return (await aggregate.toArray()) as ITechnicalSheetWithInputs[];
  }

  pipeline(input: Filter<ITechnicalSheet>) {
    return [
      { $match: input },
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
