import { IClient } from "../../../../domain/client";
import { EventObjectInterfaces, EventsTopics } from "../../../../domain/webhook/client/events/topics.events";

export interface ICreateClientUseCase {
  execute: (data: ICreateClientUseCase.Execute.Params) => Promise<ICreateClientUseCase.Execute.Result>;
}

export namespace ICreateClientUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Include]
    export type Result = IClient 
  }
}