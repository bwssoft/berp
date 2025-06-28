import { IClientFacade } from "@/app/lib/@backend/domain/commercial/facade";
import {
  createOneClientUsecase,
  updateOneClientUsecase,
  deleteOneClientUsecase,
  findManyClientUsecase,
  findOneClientUsecase,
} from "../..";

export class ClientFacade {
  public static create(): IClientFacade {
    const facade: IClientFacade = {
      createOneClientUsecase,
      updateOneClientUsecase,
      deleteOneClientUsecase,
      findManyClientUsecase,
      findOneClientUsecase,
    };
    return facade;
  }
}
