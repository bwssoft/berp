import { IControl } from "@/backend/domain/admin/entity/control.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class ControlRepository extends BaseRepository<IControl> {
  constructor() {
    super({
      collection: "admin.control",
      db: "berp",
    });
  }
}

export const controlRepository = singleton(ControlRepository);

