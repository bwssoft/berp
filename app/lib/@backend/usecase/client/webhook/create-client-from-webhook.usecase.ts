import { createOneClientUsecase, findOneClientUsecase, updateOneClientUsecase } from "..";
import { converterObjectService } from "../../../domain/client/service/converter-object-service";
import { singleton } from "@/app/lib/util";
import { ICreateClientUseCase } from "../@dto/create-client-from-webhook.usecase.dto";

class CreateClientFromWebhookUsecase implements ICreateClientUseCase {
    public async execute(
        data: ICreateClientUseCase.Execute.Params
    ): Promise<ICreateClientUseCase.Execute.Result> {
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

export const createClientFromWebhookUsecase = singleton(CreateClientFromWebhookUsecase)
