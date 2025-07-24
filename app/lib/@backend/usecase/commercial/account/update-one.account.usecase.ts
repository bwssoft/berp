import type { Filter } from "mongodb";
import { IAccount, IAccountRepository } from "@/app/lib/@backend/domain";
import { accountRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export interface Output {
    success: boolean,
    error?: {
      global?: string
    },
    editedFields?: {key: string, newValue: string, oldValue: string}[]
  };
}

class UpdateOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  @RemoveMongoId()
  async execute(filter: Filter<IAccount>, update: Partial<IAccount>): Promise<Dto.Output> {
    
    try {
      const original = await this.repository.findOne({ id: filter.id });

      if (!original) {
        return {
          success: false,
          error: {
            global: "Conta não encontrada"
          }
        };
      }
    await this.repository.updateOne({id: filter.id}, { $set: update });

    const editedFields: {key: string, newValue: string, oldValue: string}[] = [];
    for (const key of Object.keys(update)) {
      const oldValue = (original as any)[key];
      const newValue = (update as any)[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        editedFields.push({
          key: key,
          newValue: newValue,
          oldValue: oldValue
        });
      }

    }
      return {
        success: true,
        editedFields: editedFields
      };
    } catch (err) {
      console.error(err)
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const updateOneAccountUsecase = singleton(UpdateOneAccountUsecase);
