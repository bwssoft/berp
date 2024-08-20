import { IConverterObjectUsecase } from "../usecases/converter.object.usecase"
import { ICreateClientUseCase } from "../usecases/create.client.usecase"
import { IUpdateClientUseCase } from "../usecases/update.client.usecase"


export interface IClientFacade {
  converterObjectUseCase: IConverterObjectUsecase
  createClientUseCase: ICreateClientUseCase,
  updateClientUseCase: IUpdateClientUseCase
}