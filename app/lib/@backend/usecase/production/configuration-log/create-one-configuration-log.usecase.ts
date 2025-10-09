import { singleton } from "@/app/lib/util/singleton";
import IConfigurationLog from "@/app/lib/@backend/domain/production/entity/configuration-log.definition";
import { configurationLogRepository } from "@/app/lib/@backend/infra";

class CreateOneConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  async execute(input: Omit<IConfigurationLog, "id" | "created_at">) {
    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(_input);

    return _input;
  }
}

export const createOneConfigurationLogUsecase = singleton(
  CreateOneConfigurationLogUsecase
);
