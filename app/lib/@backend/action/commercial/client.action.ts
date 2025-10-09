"use server";

import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { createOneClientUsecase } from "@/backend/usecase/commercial/client/create-one-client.usecase";
import { deleteOneClientUsecase } from "@/backend/usecase/commercial/client/delete-one-client.usecase";
import { findManyClientUsecase } from "@/backend/usecase/commercial/client/find-many-client.usecase";
import { findOneClientUsecase } from "@/backend/usecase/commercial/client/find-one-client.usecase";
import { findOneClientWithConfigurationProfileUsecase } from "@/backend/usecase/commercial/client/find-one-client-with-configuration-profile.usecase";
import { updateOneClientUsecase } from "@/backend/usecase/commercial/client/update-one-client.usecase";
import { Filter } from "mongodb";

export async function createOneClient(
  client: Omit<IClient, "id" | "created_at">
) {
  return await createOneClientUsecase.execute(client);
}

export async function findOneClient(client: Partial<IClient>) {
  return await findOneClientUsecase.execute(client);
}

export async function updateOneClientById(
  query: { id: string },
  value: Omit<IClient, "id" | "created_at">
) {
  return await updateOneClientUsecase.execute(query, value);
}

export async function deleteOneClientById(query: { id: string }) {
  return await deleteOneClientUsecase.execute(query);
}

export async function findManyClient(
  query: Filter<IClient>
): Promise<IClient[]> {
  return await findManyClientUsecase.execute(query);
}

export async function findOneClientWithConfigurationProfile(
  query: Filter<IClient>
) {
  return await findOneClientWithConfigurationProfileUsecase.execute(query);
}

