import { singleton } from "@/app/lib/util/singleton";
import { IInput } from "@/backend/domain/engineer/entity/input.definition";
import { BaseRepository } from "../@base";

class InputRepository extends BaseRepository<IInput> {
  constructor() {
    super({
      collection: "engineer.input",
      db: "berp",
    });
  }
}

export const inputRepository = singleton(InputRepository);

