"use server";

import { Filter } from "mongodb";
import { IContact } from "@/backend/domain/commercial/entity/contact.definition";
import { createOneContactUsecase } from "../../usecase/commercial/contact/create-one.contact.usecase";
import { findManyContactUsecase } from "../../usecase/commercial/contact/find-many.contact.usecase";
import { findOneContactUsecase } from "../../usecase/commercial/contact/find-one.contact.usecase";
import { deleteOneContactUsecase } from "../../usecase/commercial/contact/delete-one.contact.usecase";
import { updateOneContactUsecase } from "../../usecase/commercial/contact/update-one.contact.usecase";
import { deleteManyContactUsecase } from "../../usecase/commercial/contact/delete-many-contact.usecase";

export async function createOneContact(
  contact: Omit<IContact, "id" | "created_at">
) {
  return await createOneContactUsecase.execute(contact);
}

export async function findManyContact(query: Filter<IContact>) {
  return await findManyContactUsecase.execute(query);
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

export const deleteManyContact = async (filter: Partial<IContact>) => {
  const result = await deleteManyContactUsecase.execute(filter);
  return result;
};
