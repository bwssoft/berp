import { singleton } from "@/app/lib/util/singleton";
import {
  IAccountRepository,
  IAddress,
  IAddressRepository,
} from "@/app/lib/@backend/domain";
import {
  addressRepository,
  accountRepository,
} from "@/app/lib/@backend/infra/repository";

export type DeleteManyAddressOutput = {
  success?: {
    deleted: boolean;
    deletedCount: number;
    addressIds: string[];
  };
  error?: { global: string };
};

class DeleteManyAddressUsecase {
  repository: IAddressRepository;
  repositoryAccount: IAccountRepository;

  constructor() {
    this.repository = addressRepository;
    this.repositoryAccount = accountRepository;
  }

  async execute(filter: Partial<IAddress>): Promise<DeleteManyAddressOutput> {
    try {
      // 1. Find all addresses that match the filter
      const addresses = await this.repository.findMany(filter);

      if (addresses.docs.length === 0) {
        return {
          success: { deleted: true, deletedCount: 0, addressIds: [] },
        };
      }

      const addressIds = addresses.docs
        .map((addr) => addr.id)
        .filter(Boolean) as string[];

      // 2. Delete all matching addresses
      await this.repository.deleteMany(filter);

      // 3. Remove these addresses from all accounts that reference them
      const accounts = await this.repositoryAccount.findMany({
        address: { $in: addressIds },
      });

      for (const account of accounts.docs) {
        const updatedAddresses = (account.address ?? []).filter(
          (id) => !addressIds.includes(id)
        );

        await this.repositoryAccount.updateOne(
          { id: account.id },
          { $set: { address: updatedAddresses } }
        );
      }

      return {
        success: {
          deleted: true,
          deletedCount: addressIds.length,
          addressIds,
        },
      };
    } catch (err) {
      console.error("Erro ao deletar endereços:", err);
      return {
        error: { global: "Erro inesperado ao deletar os endereços." },
      };
    }
  }
}

export const deleteManyAddressUsecase = singleton(DeleteManyAddressUsecase);
