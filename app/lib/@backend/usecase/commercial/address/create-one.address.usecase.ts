import { singleton } from "@/app/lib/util/singleton";

import { addressRepository } from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";

class CreateOneAddressUsecase {
  repository: IAddressRepository;

  constructor() {
    this.repository = addressRepository;
  }

  async execute(input: Omit<IAddress, "id" | "created_at">) {
    const address = {
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(address);

    // Add audit log
    const session = await auth();
    if (session?.user) {
      const { name, email, id: user_id } = session.user;
      await createOneAuditUsecase.execute({
        after: address,
        before: {},
        domain: AuditDomain.accountAddress,
        user: { email, name, id: user_id },
        action: `Endereço cadastrado para a conta ${address.accountId}`,
      });
    }

    return address;
  }
}

export const createOneAddressUsecase = singleton(CreateOneAddressUsecase);

