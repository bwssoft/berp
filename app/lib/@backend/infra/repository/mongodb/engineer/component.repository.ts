import { singleton } from "@/app/lib/util/singleton";
import { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import { BaseRepository } from "../@base";

class ComponentRepository extends BaseRepository<IComponent> {
  constructor() {
    super({
      collection: "engineer.component",
      db: "berp",
    });
  }
}

export const componentRepository = singleton(ComponentRepository);

