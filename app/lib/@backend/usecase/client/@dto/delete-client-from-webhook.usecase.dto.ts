import { DeleteResult } from "mongodb";
import { EventObjectInterfaces, EventsTopics } from "../../../controller/client/topics.events.dto";

export interface IDeleteClientFromWebhookUseCase {
  execute: (data: IDeleteClientFromWebhookUseCase.Execute.Params) => Promise<IDeleteClientFromWebhookUseCase.Execute.Result>;
}

export namespace IDeleteClientFromWebhookUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Delete];
    export type Result = DeleteResult
  }
}