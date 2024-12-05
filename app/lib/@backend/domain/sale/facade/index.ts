import { IDeleteClientFromWebhookUseCase } from "../../../usecase/sale/client/@dto/delete-client-from-webhook.usecase.dto"
import { IUpsertClientFromWebhookUseCase } from "../../../usecase/sale/client/@dto/upsert-client-from-webhook.usecase.dto"


export interface IClientFacade {
  upsertClientFromWebhookUsecase: IUpsertClientFromWebhookUseCase,
  deleteClientFromWebhookUseCase: IDeleteClientFromWebhookUseCase,
  createOneClientUsecase: any
  deleteOneClientUsecase: any
  findAllClientUsecase: any
  findOneClientUsecase: any
  updateOneClientUsecase: any
}