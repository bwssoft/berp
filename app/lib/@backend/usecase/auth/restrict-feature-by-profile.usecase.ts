import { singleton } from "@/app/lib/util";
import { auth } from "@/auth";

namespace Dto {
  export interface Input {
    code: string;
  }

  export type Output = boolean;
}

class RestrictFeatureByProfileUsecase {
  async execute(input: Dto.Input): Promise<Dto.Output> {
    const { code } = input;

    const session = await auth();

    if (!session) return false;

    const { user } = session;

    return !user.current_profile.locked_control_code.includes(code);
  }
}

export const restrictFeatureByProfileUsecase = singleton(
  RestrictFeatureByProfileUsecase
);
