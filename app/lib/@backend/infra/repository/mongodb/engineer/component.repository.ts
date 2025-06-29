import { singleton } from "@/app/lib/util/singleton";
import { IComponent } from "@/app/lib/@backend/domain";
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
