import { ICreateClientUseCase } from "../../../usecase/client/@dto/create-client-from-webhook.usecase.dto"
import { IUpdateClientUseCase } from "../../../usecase/client/@dto/update-client-from-webhook.usecase.dto"


export interface IClientFacade {
  createClientFromWebhookUsecase: ICreateClientUseCase,
  updateClientFromWebhookUsecase: IUpdateClientUseCase
  createOneClientUsecase: any
  deleteOneClientUsecase: any
  findAllClientUsecase: any
  findOneClientUsecase: any
  updateOneClientUsecase: any
}