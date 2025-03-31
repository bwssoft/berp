import { singleton } from "@/app/lib/util/singleton";
import { IProfileRepository } from "@/app/lib/@backend/domain";
import { profileRepository } from "@/app/lib/@backend/infra";

// Dto
namespace Dto {
  export type Input = {
    id: string;
    locked_control_code: string[];
    operation: "add" | "remove";
  };
  export type Output = { success: boolean; error?: Error };
}

// Usecase
class SetLockedControlProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const value = this.buildValue(input);
      await this.repository.updateOne({ id: input.id }, value);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // method to mount mongodb update object
  buildValue(input: Dto.Input) {
    const { locked_control_code } = input;
    return input.operation === "add"
      ? {
          $push: {
            locked_control_code: { $each: locked_control_code },
          },
        }
      : { $pullAll: { locked_control_code } };
  }
}

export const setLockedControlProfileUsecase = singleton(
  SetLockedControlProfileUsecase
);
