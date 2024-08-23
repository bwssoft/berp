import { IClientFacade } from "@/app/lib/@backend/domain/client/facade";
import {
  upsertClientFromWebhookUsecase,
  createOneClientUsecase,
  updateOneClientUsecase,
  deleteOneClientUsecase,
  findAllClientUsecase,
  findOneClientUsecase,
} from "../";

export class ClientFacade {
  public static create(): IClientFacade {
    const facade: IClientFacade = {
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