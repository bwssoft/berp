import { IClient } from "../../../../domain/client"
import { EventObjectInterfaces } from "../../../../domain/webhook/client/events/topics.events"

export interface IConverterObjectUsecase {
  execute: (data: IConverterObjectUsecase.Execute.Params) => Promise<IConverterObjectUsecase.Execute.Result>
  margeObject: (data: IConverterObjectUsecase.MergeHelper.Params) => IConverterObjectUsecase.MergeHelper.Result
}

export namespace IConverterObjectUsecase {
  export namespace Execute {
    export type Params = EventObjectInterfaces[keyof EventObjectInterfaces]
    export type Result = IClient 
  }

  export namespace MergeHelper {
    export type Params = {
      currentObject: IClient,
      entity: IClient
    }

    export type Result = IClient
  }

  export namespace MergeProps {
    export type Params = {
      excludeProps?: Array<keyof IClient>,
      entity: IClient
      currentObject: IClient
    }

    export type Result = IClient
  }
}