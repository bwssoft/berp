"use server";

import { IAddress } from "@/app/lib/@backend/domain";
import {
  createOneAddressUsecase,
  findManyAddressUsecase,
  findOneAddressUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";
import { viaCepGateway } from "../../infra/gateway/viacep/viacep.gateway";
import { redirect } from "next/navigation";

export async function getAddressByCep(cep: string) {
  return await viaCepGateway.findByCep(cep);
}

export async function createOneAddress(
  input: Omit<IAddress, "id" | "created_at">
) {
  const result = await createOneAddressUsecase.execute(input);
  if (!result) return;
}

export async function findManyAddress(
  query: Filter<IAddress>
): Promise<IAddress[]> {
  return await findManyAddressUsecase.execute(query);
}

export async function findOneAddress(query: Partial<IAddress>) {
  return await findOneAddressUsecase.execute(query);
}
