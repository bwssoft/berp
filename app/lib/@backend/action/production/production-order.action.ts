"use server";

import { revalidatePath } from "next/cache";
import { IProductionOrder } from "@/app/lib/@backend/domain";
import {
  createOneProductionOrderUsecase,
  deleteOneProductionOrderUsecase,
  findManyProductionOrderUsecase,
  findOneProductionOrderUsecase,
  updateOneProductionOrderUsecase,
} from "@/app/lib/@backend/usecase";
import { createProductionOrderFromProposalUsecase } from "../../usecase/production/production-order/create-production-order-from-proposal.usecase";

export async function createOneProductionOrder(
  productionOrder: Omit<IProductionOrder, "id" | "created_at">
) {
  await createOneProductionOrderUsecase.execute(productionOrder);
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
  revalidatePath("/production-order/dashboard");
}

export async function findOneProductionOrder(
  productionOrder: Partial<IProductionOrder>
) {
  return await findOneProductionOrderUsecase.execute(productionOrder);
}

export async function updateOneProductionOrderById(
  query: { id: string },
  value: Omit<Partial<IProductionOrder>, "id" | "created_at">
) {
  await updateOneProductionOrderUsecase.execute(query, value);
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
  revalidatePath("/production-order/dashboard");
}

export async function deleteOneProductionOrderById(query: { id: string }) {
  await deleteOneProductionOrderUsecase.execute(query);
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
  revalidatePath("/production-order/dashboard");
}

export async function findManyProductionOrder(input: Partial<IProductionOrder>) {
  return await findManyProductionOrderUsecase.execute(input);
}

export async function createProductionOrderFromProposal(input: { proposal_id: string; scenario_id: string; }) {
  await createProductionOrderFromProposalUsecase.execute(input)
  revalidatePath(`/sale/proposal/form/update?id=${input.proposal_id}`)
  revalidatePath("/production-order/management");
  revalidatePath("/production-order/kanban");
  revalidatePath("/production-order/dashboard");
}