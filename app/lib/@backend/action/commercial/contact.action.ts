"use server";

import { Filter } from "mongodb";
import { IContact } from "../../domain";
import {
  createOneContactUsecase,
  findManyContactUsecase,
  findOneContactUsecase,
} from "../../usecase";

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

export const findOneContact = async (filter: Filter<IContact>) => {
  return await findOneContactUsecase.execute(filter);
};
