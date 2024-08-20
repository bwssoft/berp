import { ICreateClientUseCase } from "@/app/lib/@backend/domain/webhook/client/usecases/create.client.usecase";

export class CreateClientUseCase implements ICreateClientUseCase {

  public async execute(data: ICreateClientUseCase.Execute.Params): Promise<ICreateClientUseCase.Execute.Result> {
    
  }
}