"use server";

import { revalidatePath } from "next/cache";
import { IProductionProcess } from "@/app/lib/@backend/domain";
import {
  createOneProductionProcessUsecase,
  findOneProductionProcessUsecase,
  updateOneProductionProcessUsecase,
  deleteOneProductionProcessUsecase,
  findAllProductionProcessUsecase,
} from "@/app/lib/@backend/usecase";


export async function createOneProductionProcess(
  productionProcess: Omit<IProductionProcess, "id" | "created_at">
) {
  await createOneProductionProcessUsecase.execute(productionProcess);
  revalidatePath("/production-order/management");
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
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
}

export async function deleteOneProductionProcessById(query: { id: string }) {
  await deleteOneProductionProcessUsecase.execute(query);
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
}

export async function findAllProductionProcess(): Promise<
  IProductionProcess[]
> {
  return await findAllProductionProcessUsecase.execute();
}
