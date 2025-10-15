"use server";
import { Filter } from "mongodb";
import { IUser } from "../../domain/admin/entity/user.definition";
import { activeUserUsecase } from "../../usecase/admin/user/active.user.usecase";
import { createOneUserUsecase } from "../../usecase/admin/user/create-one.user.usecase";
import { newPasswordUserUsecase } from "../../usecase/admin/user/new-password.user.usecase";
import { lockUserUsecase } from "../../usecase/admin/user/lock.user.usecase";
import { findOneUserUsecase } from "../../usecase/admin/user/find-one.user.usecase";
import { updateOneUserUsecase } from "../../usecase/admin/user/update-one-user.usecase";
import { findManyUserUsecase } from "../../usecase/admin/user/find-many.user.usecase";
import { resetPasswordUserUsecase } from "../../usecase/admin/user/reset-password.user.usecase";
import { requestNewPasswordUserUsecase } from "../../usecase/admin/user/request-new-password.user.usecase";
import { getAvatarUrlUserUsecase } from "../../usecase/admin/user/get-avatar-url.user.usecase";
import { revalidatePath } from "next/cache";
import { getAvatarUrlByKeyUserUsecase } from "../../usecase/admin/user/get-avatar-url-by-key.user.usecase";

type UpdateUserData = Partial<Omit<IUser, "id" | "created_at">>;

export const createOneUser = async (
  data: Omit<IUser, "id" | "created_at" | "password" | "temporary_password">,
  formData: FormData
) => {
  const result = await createOneUserUsecase.execute({
    ...data,
    formData,
  });

  revalidatePath("/admin/user");
  return result;
};

export const resetPasswordUser = async (props: { id: string }) => {
  await resetPasswordUserUsecase.execute(props);
};

export const updateUserPassword = async (data: {
  id: string;
  password: string;
}) => {
  return await newPasswordUserUsecase.execute(data);
};
export const findOneUser = async (filter: Filter<IUser>) => {
  return await findOneUserUsecase.execute(filter);
};

export async function findManyUser(
  filter: Filter<IUser> = {},
  page?: number,
  limit?: number,
  sort?: Record<string, 1 | -1>
) {
  return await findManyUserUsecase.execute({ filter, page, limit, sort });
}

export const updateOneUser = async (
  id: string,
  data: UpdateUserData,
  formData: FormData
) => {
  const result = await updateOneUserUsecase.execute({ id }, data, formData);
  revalidatePath(`/admin/user/form/update?id=${id}`);
  revalidatePath(`/admin/user`);
  return result;
};

export const lockUser = async (data: { id: string; lock: boolean }) => {
  const result = await lockUserUsecase(data);
  revalidatePath(`/admin/user/form/update?id=${data.id}`);
  revalidatePath(`/admin/user`);
  return result;
};

export const setUserActive = async (data: { id: string; active: boolean }) => {
  const result = await activeUserUsecase.execute(data);
  revalidatePath(`/admin/user/form/update?id=${data.id}`);
  return result;
};

export const getUserAvatarUrl = async (userId: string): Promise<string> => {
  return await getAvatarUrlUserUsecase.execute(userId);
};

export const getUserAvatarUrlByKey = async (userId: string, key: string): Promise<string> => {
  return await getAvatarUrlByKeyUserUsecase.execute(userId, key);
};

export const requestNewPassword = async (data: { email: string }) => {
  const result = await requestNewPasswordUserUsecase.execute(data);
  return result;
};
