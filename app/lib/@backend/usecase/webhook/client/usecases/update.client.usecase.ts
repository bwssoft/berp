import { EventsTopics } from "@/app/lib/@backend/domain/webhook/client/events/topics.events";
import { ICreateClientUseCase } from "@/app/lib/@backend/domain/webhook/client/usecases/create.client.usecase";
import { IUpdateClientUseCase } from "@/app/lib/@backend/domain/webhook/client/usecases/update.client.usecase";

export class UpdateClientUseCase implements IUpdateClientUseCase {

  constructor(
    public createClientUseCase: ICreateClientUseCase
  ) {}

  public async execute(data: IUpdateClientUseCase.Execute.Params): Promise<IUpdateClientUseCase.Execute.Result> {
    return await this.createClientUseCase.execute({
      ...data,
      topic: EventsTopics.Include
    });
  }
}