import { IClient } from "../../../../domain/sale";
import { EventObjectInterfaces, EventsTopics } from "../../../../controller/client/topics.events.dto";

export interface IUpsertClientFromWebhookUseCase {
  execute: (data: IUpsertClientFromWebhookUseCase.Execute.Params) => Promise<IUpsertClientFromWebhookUseCase.Execute.Result>;
}

export namespace IUpsertClientFromWebhookUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Include] | EventObjectInterfaces[EventsTopics.Update];
    export type Result = IClient
  }
}