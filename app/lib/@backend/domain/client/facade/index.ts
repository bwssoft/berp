import { IUpsertClientFromWebhookUseCase } from "../../../usecase/client/@dto/upsert-client-from-webhook.usecase.dto"


export interface IClientFacade {
  upsertClientFromWebhookUsecase: IUpsertClientFromWebhookUseCase,
  createOneClientUsecase: any
  deleteOneClientUsecase: any
  findAllClientUsecase: any
  findOneClientUsecase: any
  updateOneClientUsecase: any
}