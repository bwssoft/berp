import { IClientController } from "@/app/lib/@backend/domain/sale/controller/client.controller";
import { IClientFacade } from "@/app/lib/@backend/domain/sale/facade";
import { ClientFacade } from "../../usecase/sale/client/@facade";
import { EventsTopics } from "./topics.events.dto";
import { ClientOmieEntity, ClientOmieSchema } from "./client.validator";
import { BaseOmieEntity } from "./client.dto";
import { TopicEventsUseCaseConstants } from "../../domain/sale/data-mapper/topic.events.usecase.constants";

export class ClientController implements IClientController {
  private readonly ClientFacade: IClientFacade;

  constructor() {
    this.ClientFacade = ClientFacade.create();
  }

  public async execute(data: BaseOmieEntity<ClientOmieEntity>): Promise<void> {
    const topicEvent = data.topic;
    const objectEvent = await ClientOmieSchema.safeParseAsync(data.event);
    if (!objectEvent.success) {
      throw new Error("Formato do objeto inválido.");
    }

    const keyClientFacade = this.getUseCase(topicEvent);
    const useCase = this.ClientFacade[keyClientFacade];
    await useCase.execute(data as never);
  }

  private getUseCase(data: EventsTopics) {
    const usecase = TopicEventsUseCaseConstants[data];
    return usecase;
  }
}