import { singleton } from "@/app/lib/util";
import { BaseRepository } from "../@base";
import { IComponentCategory } from "@/app/lib/@backend/domain/engineer/entity/component.category.definition";

class IComponentCategoryRepository extends BaseRepository<IComponentCategory> {
  constructor() {
    super({
      collection: "engineer.component.category",
      db: "berp",
    });
  }
}

export const componentCategoryRepository = singleton(
  IComponentCategoryRepository
);
