"use server";

import { Filter } from "mongodb";
import { IPriceTable, IPriceTableConditionGroup } from "../../domain";
import { findManyPriceTableUsecase } from "../../usecase/commercial/price-table/find-many.price-table.usecase";
import { findOnePriceTableUsecase } from "../../usecase/commercial/price-table/find-one.price-table.usecase";
import { createOnePriceTableUsecase } from "../../usecase/commercial/price-table/create-one.price-table.usecase";
import { inactivatePriceTableUsecase } from "../../usecase/commercial/price-table/inactivate.price-table.usecase";
import { updateOnePriceTableUsecase } from "../../usecase/commercial/price-table/update-one.price-table.usecase";
import { cancelPriceTableUsecase } from "../../usecase/commercial/price-table/cancel.price-table.usecase";
import { validateBillingConditionsPriceTableUsecase } from "../../usecase/commercial/price-table/validate-billing-conditions.usecase";
import { publishPriceTableUsecase } from "../../usecase/commercial/price-table/publish.price-table.usecase";
import { createOneHistorical } from "./historical.action";
import { auth } from "@/auth";

export async function findManyPriceTable(
  filter: Filter<IPriceTable> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyPriceTableUsecase.execute({ filter, page, limit, sort });
}

export const findOnePriceTable = async (filter: Filter<IPriceTable>) => {
  const result = await findOnePriceTableUsecase.execute(filter);
  return result;
};

export async function createOnePriceTable(
  input: Omit<IPriceTable, "id" | "created_at" | "updated_at">
) {
  const result = await createOnePriceTableUsecase.execute(input);

  if (result.success && result.id) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${input.name}" criada.`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Criação de tabela de preços (ID: ${result.id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table creation:",
        error
      );
    }
  }

  return result;
}

export async function updateOnePriceTable(input: IPriceTable) {
  const result = await updateOnePriceTableUsecase.execute(input);

  if (result.success) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${input.name}" atualizada.`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Atualização de tabela de preços (ID: ${input.id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table update:",
        error
      );
    }
  }

  return result;
}

export const inactivatePriceTable = async (id: string) => {
  const priceTable = await findOnePriceTableUsecase.execute({ id });
  const result = await inactivatePriceTableUsecase.execute({ id });

  if (result.success && priceTable) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${priceTable.name}" inativada.`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Inativação de tabela de preços (ID: ${id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table inactivation:",
        error
      );
    }
  }

  return result;
};

export const cancelPriceTable = async (id: string) => {
  const priceTable = await findOnePriceTableUsecase.execute({ id });
  const result = await cancelPriceTableUsecase.execute({ id });

  if (result.success && priceTable) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${priceTable.name}" cancelada.`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Cancelamento de tabela de preços (ID: ${id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table cancellation:",
        error
      );
    }
  }

  return result;
};

export const validateBillingConditionsPriceTable = async (
  groups: Array<IPriceTableConditionGroup & { priorityEnabled?: boolean }>
) => {
  return await validateBillingConditionsPriceTableUsecase.execute({ groups });
};

export const publishPriceTable = async (id: string) => {
  const priceTable = await findOnePriceTableUsecase.execute({ id });
  const result = await publishPriceTableUsecase.execute({ id });

  if (result.success && priceTable) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${priceTable.name}" publicada.`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Publicação de tabela de preços (ID: ${id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table publication:",
        error
      );
    }
  }

  return result;
};

export const clonePriceTable = async (id: string) => {
  const originalTable = await findOnePriceTableUsecase.execute({ id });

  if (!originalTable) {
    throw new Error("Tabela de preços não encontrada");
  }

  const clonedTable: Omit<IPriceTable, "id" | "created_at" | "updated_at"> = {
    name: `${originalTable.name} (Cópia)`,
    startDateTime: new Date(),
    endDateTime: originalTable.isTemporary ? new Date() : undefined,
    isTemporary: originalTable.isTemporary,
    status: "DRAFT",
    groups: originalTable.groups,
    equipmentPayment: originalTable.equipmentPayment,
    equipmentSimcardPayment: originalTable.equipmentSimcardPayment,
    simcardPayment: originalTable.simcardPayment,
    servicePayment: originalTable.servicePayment,
  };

  const result = await createOnePriceTableUsecase.execute(clonedTable);

  if (result.success && result.id) {
    try {
      const session = await auth();
      await createOneHistorical({
        accountId: "system",
        title: `Tabela de preços "${clonedTable.name}" clonada a partir de "${originalTable.name}".`,
        type: "sistema",
        author: {
          name: session?.user?.name ?? "Sistema",
          avatarUrl: "",
        },
        action: `Clonagem de tabela de preços (Original ID: ${id}, Nova ID: ${result.id})`,
      });
    } catch (error) {
      console.warn(
        "Failed to create historical record for price table cloning:",
        error
      );
    }
  }

  return result;
};
