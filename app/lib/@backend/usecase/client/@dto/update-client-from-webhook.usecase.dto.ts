import { IClient } from "../../../domain/client";
import { EventObjectInterfaces, EventsTopics } from "../../../controller/client/topics.events.dto";

export interface IUpdateClientUseCase {
  execute: (data: IUpdateClientUseCase.Execute.Params) => Promise<IUpdateClientUseCase.Execute.Result>;
}

export namespace IUpdateClientUseCase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[EventsTopics.Update]
    export type Result = IClient
  }
}