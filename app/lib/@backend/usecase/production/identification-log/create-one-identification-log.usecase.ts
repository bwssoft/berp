import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import type { IIdentificationLog } from "@/backend/domain/production/entity/identification-log.definition";
import type { IIdentificationLogRepository } from "@/backend/domain/production/repository/identification-log.repository";
import { identificationLogRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

class CreateOneIdentificationLogUsecase {
  repository: IIdentificationLogRepository;

  constructor() {
    this.repository = identificationLogRepository;
  }

  @RemoveFields("_id")
  async execute(input: Omit<IIdentificationLog, "id" | "created_at">) {
    const payload: IIdentificationLog = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(payload);

    return payload;
  }
}

export const createOneIdentificationLogUsecase = singleton(
  CreateOneIdentificationLogUsecase
);
