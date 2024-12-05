import { EventObjectInterfaces, EventsTopics } from "@/app/lib/@backend/infra/api/controller/sale/client/topics.events.dto";
import { DeleteResult } from "mongodb";

export interface IDeleteClientFromWebhookUseCase {
  execute: (data: IDeleteClientFromWebhookUseCase.Execute.Params) => Promise<IDeleteClientFromWebhookUseCase.Execute.Result>;
}

export namespace IDeleteClientFromWebhookUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Delete];
    export type Result = DeleteResult
  }
}