import { singleton } from "@/app/lib/util/singleton";
import { ISector } from "@/app/lib/@backend/domain";
import { sectorRepository } from "../../../infra/repository";
import { findManySectorUsecase } from "./find-many.sector.usecase";
import { normalizeString } from "@/app/lib/util/normalize-string";
import { AppError } from "@/app/lib/util/app-error";

class CreateOneSectorUsecase {
  async execute(
    input: Omit<ISector, "id" | "created_at" | "updated_at">
  ): Promise<ISector> {
    const { docs: sectors } = await findManySectorUsecase.execute({});
    const normalizedInputName = normalizeString(input.name);

    const duplicated = sectors.find(
      (sector) => normalizeString(sector.name) === normalizedInputName
    );

    if (duplicated) {
      const same = duplicated.name === input.name;
      if (same) {
        throw new AppError(
          "DUPLICATED_SECTOR",
          "Já existe um setor com esse nome."
        );
      } else {
        throw new AppError(
          "SIMILAR_SECTOR",
          `Já existe um setor com nome semelhante: "${duplicated.name}".`
        );
      }
    }

    const sector: ISector = {
      ...input,
      id: crypto.randomUUID(),
      active: true,
      created_at: new Date(),
    };

    await sectorRepository.create(sector);
    return sector;
  }
}

export const createOneSectorUsecase = singleton(CreateOneSectorUsecase);
