import { IClientFacade } from "@/app/lib/@backend/domain/commercial/facade";
import {
  upsertClientFromWebhookUsecase,
  deleteClientFromWebhookUseCase,
  createOneClientUsecase,
  updateOneClientUsecase,
  deleteOneClientUsecase,
  findAllClientUsecase,
  findOneClientUsecase,
} from "../..";

export class ClientFacade {
  public static create(): IClientFacade {
    const facade: IClientFacade = {
      deleteClientFromWebhookUseCase,
      upsertClientFromWebhookUsecase,
      createOneClientUsecase,
      updateOneClientUsecase,
      deleteOneClientUsecase,
      findAllClientUsecase,
      findOneClientUsecase
    }
    return facade;
  }
}