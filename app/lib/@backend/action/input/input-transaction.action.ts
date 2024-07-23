"use server"

import { IInput, IInputTransaction } from "@/app/lib/@backend/domain";
import { countInputTransactionUsecase, createOneInputTransactionUsecase, findAllInputTransactionWithInputUsecase } from "../../usecase";
import { revalidatePath } from "next/cache";


export async function createOneInputTransaction(input: Omit<IInputTransaction, "id" | "created_at">) {
  await createOneInputTransactionUsecase.execute(input)
  revalidatePath("/input/enter-exit")
  return input
}

export async function findAllInputTransactionWithInput(): Promise<(IInputTransaction & { input: IInput })[]> {
  return await findAllInputTransactionWithInputUsecase.execute()
}

export async function countInputTransaction(input_id?: string) {
  return await countInputTransactionUsecase.execute(input_id)
}

