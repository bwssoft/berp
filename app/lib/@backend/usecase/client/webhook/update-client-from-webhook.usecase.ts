import { createClientFromWebhookUsecase } from "./create-client-from-webhook.usecase";
import { singleton } from "@/app/lib/util";
import { IUpdateClientUseCase } from "../@dto/update-client-from-webhook.usecase.dto";
import { EventsTopics } from "../../../controller/client/topics.events.dto";

export class UpdateClientFromWebhookUseCase implements IUpdateClientUseCase {

  public async execute(data: IUpdateClientUseCase.Execute.Params): Promise<IUpdateClientUseCase.Execute.Result> {
    return await createClientFromWebhookUsecase.execute({
      ...data,
      topic: EventsTopics.Include
    });
  }
}

export const updateClientFromWebhookUsecase = singleton(UpdateClientFromWebhookUseCase)