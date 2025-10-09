"use server";

import { revalidatePath } from "next/cache";
import { IProductionProcess } from "@/backend/domain/production/entity/production-process.definition";
import { createOneProductionProcessUsecase } from "@/backend/usecase/production/production-process/create-one-production-process.usecase";
import { findOneProductionProcessUsecase } from "@/backend/usecase/production/production-process/find-one-production-process.usecase";
import { updateOneProductionProcessUsecase } from "@/backend/usecase/production/production-process/update-one-production-process.usecase";
import { deleteOneProductionProcessUsecase } from "@/backend/usecase/production/production-process/delete-one-production-process.usecase";
import { findAllProductionProcessUsecase } from "@/backend/usecase/production/production-process/find-all-production-process.usecase";


export async function createOneProductionProcess(
  productionProcess: Omit<IProductionProcess, "id" | "created_at">
) {
  await createOneProductionProcessUsecase.execute(productionProcess);
  revalidatePath("/production/production-order/management");
}

export async function findOneProductionProcess(
  productionProcess: Partial<IProductionProcess>
) {
  return await findOneProductionProcessUsecase.execute(productionProcess);
}

export async function updateOneProductionProcessById(
  query: { id: string },
  value: Omit<Partial<IProductionProcess>, "id" | "created_at">
) {
  await updateOneProductionProcessUsecase.execute(query, value);
  revalidatePath("/production/production-order/management");
  revalidatePath("/production/production-order/kanban");
}

export async function deleteOneProductionProcessById(query: { id: string }) {
  await deleteOneProductionProcessUsecase.execute(query);
  revalidatePath("/production/production-order/management");
  revalidatePath("/production/production-order/kanban");
}

export async function findAllProductionProcess(): Promise<
  IProductionProcess[]
> {
  return await findAllProductionProcessUsecase.execute();
}

