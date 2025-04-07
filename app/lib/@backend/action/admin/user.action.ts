"use server";

import { IUser } from "../../domain/admin/entity/user.definition";
import {
    activeUserUsecase,
    createOneUserUsecase,
    newPasswordUserUsecase,
    lockUserUsecase,
} from "../../usecase";
import { resetPasswordUserUsecase } from "../../usecase/admin/user/reset-password.user.usecase";

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

export const updateUserPassword = async (data: {
    id: string;
    password: string;
}) => {
    return await newPasswordUserUsecase.execute(data);
};

export const lockUser = async (data: { id: string; lock: boolean }) => {
    return await lockUserUsecase(data);
};

export const setUserActive = async (data: { id: string; active: boolean }) => {
    return await activeUserUsecase.execute(data);
};
