import { IClientController } from "@/app/lib/@backend/domain/sale/controller/client.controller";
import { IClientFacade } from "@/app/lib/@backend/domain/sale/facade";
import { EventsTopics } from "./topics.events.dto";
import { ClientOmieEntity, ClientOmieSchema } from "./client.validator";
import { BaseOmieEntity } from "./client.dto";
import { ClientFacade } from "@/app/lib/@backend/usecase/sale/client/@facade";
import { TopicEventsUseCaseConstants } from "@/app/lib/@backend/domain";

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