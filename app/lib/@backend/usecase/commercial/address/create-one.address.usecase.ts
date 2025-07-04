import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IAddress,
  IAddressRepository,
} from "@/app/lib/@backend/domain";
import { addressRepository } from "@/app/lib/@backend/infra/repository";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

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
