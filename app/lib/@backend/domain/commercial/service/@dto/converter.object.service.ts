import { EventObjectInterfaces } from "@/app/lib/@backend/infra/api/controller/commercial/client/topics.events.dto"
import { IClient } from "../.."

export interface IConverterObjectService {
  execute: (data: IConverterObjectService.Execute.Params) => Promise<IConverterObjectService.Execute.Result>
  margeObject: (data: IConverterObjectService.MergeHelper.Params) => IConverterObjectService.MergeHelper.Result
}

export namespace IConverterObjectService {
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