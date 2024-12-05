import { createOneClientUsecase, findOneClientUsecase, updateOneClientUsecase } from "..";
import { converterObjectService } from "../../../domain/sale/service/converter-object-service";
import { singleton } from "@/app/lib/util";
import { IUpsertClientFromWebhookUseCase } from "../client/@dto/upsert-client-from-webhook.usecase.dto";

class UpsertClientFromWebhookUsecase implements IUpsertClientFromWebhookUseCase {
    public async execute(
        data: IUpsertClientFromWebhookUseCase.Execute.Params
    ): Promise<IUpsertClientFromWebhookUseCase.Execute.Result> {
        const client = await converterObjectService.execute(data);
        const clientExists = await findOneClientUsecase.execute({
            document: {
                value: client.document.value,
                type: client.document.type,
            },
        });

        if (!clientExists) {
            await createOneClientUsecase.execute(client);
            return client;
        }

        const mergeEntity = converterObjectService.margeObject({
            currentObject: client,
            entity: clientExists,
        });

        await updateOneClientUsecase.execute({ id: clientExists.id }, mergeEntity);

        return client;
    }
}

export const upsertClientFromWebhookUsecase = singleton(UpsertClientFromWebhookUsecase)
