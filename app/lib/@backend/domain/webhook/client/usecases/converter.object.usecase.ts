import { IClient } from "../../../../domain/client"
import { EventObjectInterfaces } from "../../../../domain/webhook/client/events/topics.events"

export interface IConverterObjectUsecase {
  execute: (data: IConverterObjectUsecase.Execute.Params) => Promise<IConverterObjectUsecase.Execute.Result>
}

export namespace IConverterObjectUsecase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[keyof EventObjectInterfaces]
    export type Result = IClient 
  }
}