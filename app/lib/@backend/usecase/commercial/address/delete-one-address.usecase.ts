import { singleton } from "@/app/lib/util/singleton";

import {
    addressRepository,
    accountRepository,
} from "@/backend/infra";

export type DeleteAddressOutput = {
    success?: { deleted: boolean; addressId: string };
    error?: { global: string };
};

class DeleteOneAddressUsecase {
    repository: IAddressRepository;
    repositoryAccount: IAccountRepository;

    constructor() {
        this.repository = addressRepository;
        this.repositoryAccount = accountRepository;
    }

    async execute(input: Partial<IAddress>): Promise<DeleteAddressOutput> {
        try {
            const addressId = input.id;

            if (!addressId) {
                return {
                    error: { global: "ID do endereço não informado." },
                };
            }

            // 1. Excluir o endereço
            await this.repository.deleteOne({ id: addressId });

            // 2. Remover esse endereço de todas as contas
            const accounts = await this.repositoryAccount.findMany({
                address: addressId,
            });

            for (const account of accounts.docs) {
                const updatedAddresses = (account.address ?? []).filter(
                    (id) => id !== addressId
                );

                await this.repositoryAccount.updateOne(
                    { id: account.id },
                    { $set: { address: updatedAddresses } }
                );
            }

            return {
                success: { deleted: true, addressId },
            };
        } catch (err) {
            console.error("Erro ao deletar endereço:", err);
            return {
                error: { global: "Erro inesperado ao deletar o endereço." },
            };
        }
    }
}

export const deleteOneAddressUsecase = singleton(DeleteOneAddressUsecase);

