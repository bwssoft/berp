"use server";
import { Filter } from "mongodb";
import { IUser } from "../../domain/admin/entity/user.definition";
import {
    createOneUserUsecase,
    findOneUserUsecase,
    updateOneUserUsecase,
} from "../../usecase";
import { resetPasswordUserUsecase } from "../../usecase/admin/user/reset-password.user.usecase";

type UpdateUserData = Partial<Omit<IUser, "id" | "created_at">>;

export const createOneUser = async (
    data: Omit<IUser, "id" | "created_at" | "password">
) => {
    return await createOneUserUsecase.execute(data);
};

export const resetPasswordUser = async () => {
    await resetPasswordUserUsecase.execute({
        id: "9cbe760c-6fd7-4137-ab6d-3be9427445ad",
    });
};

export const findOneUser = async (filter: Filter<IUser>) => {
    return await findOneUserUsecase.execute(filter);
};

export const updateOneUser = async (id: string, data: UpdateUserData) => {
    return await updateOneUserUsecase.execute({ id }, data);
};
