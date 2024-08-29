import { singleton } from "@/app/lib/util";
import { IInputCategory } from "../../../domain/input/entity/input-category.definition";
import { BaseRepository } from "../@base/base";

class IInputCategoryRepository extends BaseRepository<IInputCategory> {
  constructor() {
    super({
      collection: "category",
      db: "berp"
    })
  }
}

export const inputCategoryRepository = singleton(IInputCategoryRepository)