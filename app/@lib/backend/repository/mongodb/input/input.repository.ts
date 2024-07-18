import { IInput } from "../../../domain";
import { BaseRepository } from "../@base/base";

class InputRepository extends BaseRepository<IInput> {
  private static instance: InputRepository;

  private constructor() {
    super({
      collection: "input",
      db: "bstock"
    });
  }

  public static getInstance(): InputRepository {
    if (!InputRepository.instance) {
      InputRepository.instance = new InputRepository();
    }
    return InputRepository.instance;
  }
}

export const inputRepository = InputRepository.getInstance();
