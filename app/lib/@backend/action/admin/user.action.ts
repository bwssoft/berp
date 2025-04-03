"use server";

import { createOneUserUsecase } from "../../usecase";
import { resetPasswordUserUsecase } from "../../usecase/admin/user/reset-password.user.usecase";

export const createOneUser = async () => {
    await createOneUserUsecase.execute({
        cpf: "86643202507",
        email: "oliveiralauane91@gmail.com",
        name: "Lauane Oliveira",
        active: true,
        image: "",
        lock: false,
        profile_id: "",
        username: "laulau",
        password_request_token: "",
    });
};

export const resetPasswordUser = async () => {
    await resetPasswordUserUsecase.execute({
        id: "9cbe760c-6fd7-4137-ab6d-3be9427445ad",
    });
};
