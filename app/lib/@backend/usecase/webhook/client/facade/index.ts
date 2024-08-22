import { IClientFacade } from "@/app/lib/@backend/domain/webhook/client/facade";
import { ConverterObjectUseCase } from "../usecases/converter.object.usecase";
import { CreateClientUseCase } from "../usecases/create.client.usecase";
import { UpdateClientUseCase } from "../usecases/update.client.usecase";

export class ClientFacade {
  public static create(): IClientFacade {
    const converterObjectUseCase = new ConverterObjectUseCase();
    const createClientUseCase = new CreateClientUseCase(
      converterObjectUseCase
    );
    const updateClientUseCase = new UpdateClientUseCase();

    const facade: IClientFacade = {
      converterObjectUseCase,
      createClientUseCase,
      updateClientUseCase
    }

    return facade;
  }
}