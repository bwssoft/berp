import { singleton } from "@/app/lib/util/singleton";
import { ICommand } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class CommandRepository extends BaseRepository<ICommand> {
  constructor() {
    super({
      collection: "command",
      db: "berp"
    });
  }
}

export const commandRepository = singleton(CommandRepository)
