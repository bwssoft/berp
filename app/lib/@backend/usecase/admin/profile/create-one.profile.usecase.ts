import { singleton } from "@/app/lib/util/singleton";
import { IProfile, IProfileRepository } from "@/app/lib/@backend/domain";
import { profileRepository } from "@/app/lib/@backend/infra";

class CreateOneProfileUsecase {
  repository: IProfileRepository;

  constructor() {
    this.repository = profileRepository;
  }

  async execute(input: Omit<IProfile, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });
    return await this.repository.create(client);
  }
}

export const createOneProfileUsecase = singleton(CreateOneProfileUsecase);
