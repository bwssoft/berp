import { singleton } from "@/app/lib/util/singleton";
import { IInput } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class InputRepository extends BaseRepository<IInput> {
  constructor() {
    super({
      collection: "input",
      db: "bstock"
    });
  }
}

export const inputRepository = singleton(InputRepository)
