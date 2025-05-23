"use server";

import { Filter } from "mongodb";
import { IContact } from "../../domain";
import {
  createOneContactUsecase,
  findManyContactUsecase,
  findOneContactUsecase,
} from "../../usecase";
import {
  deleteOneContactUsecase,
  updateOneContactUsecase,
} from "../../usecase/commercial/contact";

export async function createOneContact(
  contact: Omit<IContact, "id" | "created_at">
) {
  return await createOneContactUsecase.execute(contact);
}

export async function findManyContact(
  filter: Filter<IContact> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyContactUsecase.execute({ filter, page, limit, sort });
}

export async function updateOneContact(
  filter: Filter<IContact>,
  update: Partial<IContact>
) {
  return await updateOneContactUsecase.execute(filter, update);
}

export const findOneContact = async (filter: Filter<IContact>) => {
  return await findOneContactUsecase.execute(filter);
};

export const deleteOneContact = async (query: { id: string }) => {
  return await deleteOneContactUsecase.execute(query);
};
