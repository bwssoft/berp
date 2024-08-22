import { IClientController } from "@/app/lib/@backend/domain/webhook/client/controller/client.controller";
import { BaseOmieEntity } from "@/app/lib/@backend/domain/webhook/client/entities/base.omie.entity";
import { ClientOmieEntity, ClientOmieSchema } from "@/app/lib/@backend/domain/webhook/client/entities/client.omie.entity";
import { EventObjectInterfaces, EventsTopics } from "@/app/lib/@backend/domain/webhook/client/events/topics.events";
import { IClientFacade } from "@/app/lib/@backend/domain/webhook/client/facade";
import { ClientFacade } from "../facade";
import { TopicEventsUseCaseConstants } from "@/app/lib/@backend/domain/webhook/client/constants/topic.events.usecase.constants";

export class ClientController implements IClientController {
  private readonly ClientFacade: IClientFacade;

  constructor() {
    this.ClientFacade = ClientFacade.create();
  }

  public async execute(data: BaseOmieEntity<ClientOmieEntity>): Promise<void> {
    const topicEvent = data.topic;
    const objectEvent = await ClientOmieSchema.safeParseAsync(data.event);
    if(!objectEvent.success) {
      console.log(objectEvent.error);
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