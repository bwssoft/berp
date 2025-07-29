"use server";

import { IAddress } from "@/app/lib/@backend/domain";
import {
  createOneAddressUsecase,
  findManyAddressUsecase,
  findOneAddressUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";
import { viaCepGateway } from "../../infra/gateway/viacep/viacep.gateway";
import { updateOneAddressUsecase } from "../../usecase/commercial/address/update-one.address.usecase";
import { revalidatePath } from "next/cache";
import { deleteOneAddressUsecase } from "../../usecase/commercial/address/delete-one-address.usecase";
import { deleteManyAddressUsecase } from "../../usecase/commercial/address/delete-many-address.usecase";

let PATH_address = "commercial/account/form/create/tab/address";

export async function getAddressByCep(cep: string) {
  return await viaCepGateway.findByCep(cep);
}

export async function createOneAddress(
  input: Omit<IAddress, "id" | "created_at">
) {
  const result = await createOneAddressUsecase.execute(input);
  revalidatePath(PATH_address, "page");
  if (!result) return;
}

export async function findManyAddress(
  query: Filter<IAddress>
): Promise<IAddress[]> {
  return await findManyAddressUsecase.execute(query);
}
export async function updateOneAddress(
  filter: Filter<IAddress>,
  update: Partial<IAddress>
) {
  const result = await updateOneAddressUsecase.execute(filter, update);
  revalidatePath(PATH_address, "page");
  return result;
}
export async function findOneAddress(query: Partial<IAddress>) {
  return await findOneAddressUsecase.execute(query);
}

export async function deleteOneAddress(filter: Partial<IAddress>) {
  const result = await deleteOneAddressUsecase.execute(filter);
  return result;
}

export async function deleteManyAddress(filter: Partial<IAddress>) {
  const result = await deleteManyAddressUsecase.execute(filter);
  revalidatePath(PATH_address, "page");
  return result;
}
