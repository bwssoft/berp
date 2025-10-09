import { singleton } from "@/app/lib/util/singleton";
import { IHistorical } from "@/backend/domain/commercial/entity/historical.definition";
import { IHistoricalRepository } from "@/backend/domain/commercial/repository/historical.repository";
import { historicalRepository } from "@/backend/infra";

export type OutputHistorical = {
  success?: IHistorical;
  error?: {
    global?: string;
  };
};

class CreateOneHistoricalUsecase {
  repository: IHistoricalRepository;

  constructor() {
    this.repository = historicalRepository;
  }

  async execute(input: Omit<IHistorical, "id" | "created_at">): Promise<OutputHistorical> {
    try {
      const historical: IHistorical = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date(),
        accountId: input.accountId ?? "",
      };

      await this.repository.create(historical);

      return { success: historical };
    } catch (error) {
      console.error(error);
      return {
        error: { global: "Falha ao criar histórico." },
      };
    }
  }
}

export const createOneHistoricalUsecase = singleton(CreateOneHistoricalUsecase);
