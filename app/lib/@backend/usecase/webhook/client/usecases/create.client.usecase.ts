import { IClient } from "@/app/lib/@backend/domain";
import { IConverterObjectUsecase } from "@/app/lib/@backend/domain/webhook/client/usecases/converter.object.usecase";
import { ICreateClientUseCase } from "@/app/lib/@backend/domain/webhook/client/usecases/create.client.usecase";
import { createOneClientUsecase, findOneClientUsecase, updateOneClientUsecase } from "../../../client";

export class CreateClientUseCase implements ICreateClientUseCase {
    constructor(
        private readonly converterObjectUsecase: IConverterObjectUsecase
    ) {}

    public async execute(
        data: ICreateClientUseCase.Execute.Params
    ): Promise<ICreateClientUseCase.Execute.Result> {
        const client = await this.converterObjectUsecase.execute(data);
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

        const mergeEntity = this.converterObjectUsecase.margeObject({
            currentObject: client,
            entity: clientExists,
        });

        await updateOneClientUsecase.execute({ id: clientExists.id }, mergeEntity);

        return client;
    }
}
