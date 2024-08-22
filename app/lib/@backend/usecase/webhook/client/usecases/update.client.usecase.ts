import { IClient } from "@/app/lib/@backend/domain";
import { IUpdateClientUseCase } from "@/app/lib/@backend/domain/webhook/client/usecases/update.client.usecase";

export class UpdateClientUseCase implements IUpdateClientUseCase {

  public async execute(data: IUpdateClientUseCase.Execute.Params): Promise<IUpdateClientUseCase.Execute.Result> {
    return {} as IClient;
  }
}