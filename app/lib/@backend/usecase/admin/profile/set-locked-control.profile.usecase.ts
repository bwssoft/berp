import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import { IProfileRepository } from "@/backend/domain/admin/repository/profile.repository";
import { profileRepository } from "@/backend/infra";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit";
import { auth } from "@/auth";

// Dto
namespace Dto {
  export type Input = {
    id: string;
    locked_control_code: string[];
    operation: "add" | "remove";
    control_name: string;
  };
  export type Output = { success: boolean; error?: string };
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
      const before = await this.repository.findOne({ id: input.id });
      if (!before)
        return {
          success: false,
          error: "Profile not found.",
        };
      await this.repository.updateOne({ id: input.id }, value);
      const after = await this.repository.findOne({ id: input.id });
      if (!after)
        return {
          success: false,
          error: "Profile not found.",
        };
      const session = await auth();
      const { name, email, id } = session?.user!;
      await createOneAuditUsecase.execute({
        after,
        before,
        domain: AuditDomain.profile,
        user: { email, id, name },
        action: `Acesso '${input.control_name}' ${input.operation === "add" ? "liberado" : "removido"} para o perfil '${before.name}'`,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : JSON.stringify(error),
      };
    }
  }

  // method to mount mongodb update object
  // method to build mongodb update object, evitando duplicados na adição
  buildValue(input: Dto.Input) {
    const { locked_control_code } = input;

    if (input.operation === "add") {
      return {
        $addToSet: {
          locked_control_code: { $each: locked_control_code },
        },
      };
    }

    return {
      $pullAll: {
        locked_control_code,
      },
    };
  }
}

export const setLockedControlProfileUsecase = singleton(
  SetLockedControlProfileUsecase
);

