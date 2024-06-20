import { IInput } from "../definition";
import inputRepository from "../repository/mongodb/input.repository";
import { BaseAction } from "./@base/base";


class InputAction extends BaseAction<IInput> {
  private static instance: InputAction;

  private constructor() {
    super({
      repository: inputRepository
    })
  }

  public static getInstance(): InputAction {
    if (!InputAction.instance) {
      InputAction.instance = new InputAction();
    }
    return InputAction.instance;
  }
}

export default InputAction.getInstance();
