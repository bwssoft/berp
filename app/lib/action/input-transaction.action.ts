import { IInputTransaction } from "../definition";
import inputTransactionRepository from "../repository/mongodb/input-transaction.repository";
import { BaseAction } from "./@base/base";


class InputTransationAction extends BaseAction<IInputTransaction> {
  private static instance: InputTransationAction;

  private constructor() {
    super({
      repository: inputTransactionRepository
    })
  }

  public static getInstance(): InputTransationAction {
    if (!InputTransationAction.instance) {
      InputTransationAction.instance = new InputTransationAction();
    }
    return InputTransationAction.instance;
  }
}

export default InputTransationAction.getInstance();
