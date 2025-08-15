import type { Filter } from "mongodb";
import { IAccount, IAccountRepository } from "@/app/lib/@backend/domain";
import { accountRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export interface Output {
    success: boolean;
    error?: {
      global?: string;
    };
    editedFields?: { key: string; newValue: string; oldValue: string }[];
  }
}

class UpdateOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  @RemoveMongoId()
  async execute(
    filter: Filter<IAccount>,
    update: Partial<IAccount>
  ): Promise<Dto.Output> {
    try {
      const original = await this.repository.findOne({ id: filter.id });

      if (!original) {
        return {
          success: false,
          error: {
            global: "Conta não encontrada",
          },
        };
      }
      const now = new Date();
      await this.repository.updateOne(filter, {
        $set: { ...update, updated_at: now },
      });

      const editedFields: {
        key: string;
        newValue: string;
        oldValue: string;
      }[] = [];
      for (const key of Object.keys(update)) {
        const oldValue = (original as any)[key];
        const newValue = (update as any)[key];

        if (
          JSON.stringify(oldValue) !== JSON.stringify(newValue) &&
          (key === "economic_group_holding" ||
            key === "economic_group_controlled")
        ) {
          let oldStringValue = "";
          let newStringValue = "";

          oldValue.map((item: any, key: any) => {
            key == 0
              ? (oldStringValue += `${item.name}`)
              : (oldStringValue += `, ${item.name}`);
          });

          newValue.map((item: any, key: any) => {
            key == 0
              ? (newStringValue += `${item.name}`)
              : (newStringValue += `, ${item.name}`);
          });

          editedFields.push({
            key: key,
            newValue: newStringValue,
            oldValue: oldStringValue,
          });
        } else if (
          JSON.stringify(oldValue) !== JSON.stringify(newValue) &&
          key === "document"
        ) {
          editedFields.push({
            key: key,
            newValue: newValue[0].value,
            oldValue: oldValue[0].value,
          });
        } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          editedFields.push({
            key: key,
            newValue: newValue,
            oldValue: oldValue,
          });
        }
      }
      return {
        success: true,
        editedFields: editedFields,
      };
    } catch (err) {
      console.error(err);
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
