import { IClientFacade } from "@/app/lib/@backend/domain/client/facade";
import {
  createClientFromWebhookUsecase,
  createOneClientUsecase,
  updateClientFromWebhookUsecase,
  updateOneClientUsecase,
  deleteOneClientUsecase,
  findAllClientUsecase,
  findOneClientUsecase,
} from "../";

export class ClientFacade {
  public static create(): IClientFacade {
    const facade: IClientFacade = {
      createClientFromWebhookUsecase,
      updateClientFromWebhookUsecase,
      createOneClientUsecase,
      updateOneClientUsecase,
      deleteOneClientUsecase,
      findAllClientUsecase,
      findOneClientUsecase
    }
    return facade;
  }
}