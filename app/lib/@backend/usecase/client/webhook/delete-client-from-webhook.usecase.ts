import { singleton } from "@/app/lib/util";
import { converterObjectService } from "../../../domain/client/service/converter-object-service";
import { IDeleteClientFromWebhookUseCase } from "../@dto/delete-client-from-webhook.usecase.dto";
import { deleteOneClientUsecase } from "../client";

class DeleteClientFromWebhookUseCase implements IDeleteClientFromWebhookUseCase {
    public async execute(
        data: IDeleteClientFromWebhookUseCase.Execute.Params
    ): Promise<IDeleteClientFromWebhookUseCase.Execute.Result> {
      const client = await converterObjectService.execute(data);
      const entityDelete = await deleteOneClientUsecase.execute({
        document: client.document
      })

      return entityDelete;
    }
}

export const deleteClientFromWebhookUseCase = singleton(DeleteClientFromWebhookUseCase);