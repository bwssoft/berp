import { IDeleteClientFromWebhookUseCase } from "@/app/lib/@backend/usecase/commercial/client/@dto/delete-client-from-webhook.usecase.dto"
import { IUpsertClientFromWebhookUseCase } from "@/app/lib/@backend/usecase/commercial/client/@dto/upsert-client-from-webhook.usecase.dto"


export interface IClientFacade {
  upsertClientFromWebhookUsecase: IUpsertClientFromWebhookUseCase,
  deleteClientFromWebhookUseCase: IDeleteClientFromWebhookUseCase,
  createOneClientUsecase: any
  deleteOneClientUsecase: any
  findManyClientUsecase: any
  findOneClientUsecase: any
  updateOneClientUsecase: any
}