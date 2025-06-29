import { singleton } from "@/app/lib/util";
import { BaseRepository } from "../@base";
import { IInputCategory } from "@/app/lib/@backend/domain";

class IInputCategoryRepository extends BaseRepository<IInputCategory> {
  constructor() {
    super({
      collection: "engineer.input.category",
      db: "berp",
    });
  }
}

export const inputCategoryRepository = singleton(IInputCategoryRepository);
