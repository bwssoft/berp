import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IProfile } from "@/backend/domain/admin/entity/profile.definition";
import type { IProfileRepository } from "@/backend/domain/admin/repository/profile.repository.interface";
import { profileRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";
import { findManyControlUsecase } from "../control/find-many-control.usecase";

class CreateOneProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  async execute(input: Omit<IProfile, "id" | "created_at">) {
    try {
      const profile = await this.repository.findOne({ name: input.name });
      if (profile) {
        return {
          success: false,
          error: { name: "Nome já cadastrado para outro perfil!" },
        };
      }
      const { docs: controls } = await findManyControlUsecase.execute({
        limit: 200,
      });
      const _input = Object.assign(input, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        locked_control_code: [],
      });
      await this.repository.create(_input);

      const session = await auth();
      const { name, email, id: user_id } = session?.user!;
      await createOneAuditUsecase.execute({
        after: _input,
        before: {},
        domain: AuditDomain.profile,
        user: { email, name, id: user_id },
        action: "Perfil cadastrado",
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const createOneProfileUsecase = singleton(CreateOneProfileUsecase);


