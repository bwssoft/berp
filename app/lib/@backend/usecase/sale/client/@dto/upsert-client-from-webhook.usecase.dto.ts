import { EventObjectInterfaces, EventsTopics } from "@/app/lib/@backend/infra/api/controller/sale/client/topics.events.dto";
import { IClient } from "../../../../domain/sale";

export interface IUpsertClientFromWebhookUseCase {
  execute: (data: IUpsertClientFromWebhookUseCase.Execute.Params) => Promise<IUpsertClientFromWebhookUseCase.Execute.Result>;
}

export namespace IUpsertClientFromWebhookUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Include] | EventObjectInterfaces[EventsTopics.Update];
    export type Result = IClient
  }
}