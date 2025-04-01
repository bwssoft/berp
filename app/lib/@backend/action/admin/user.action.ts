"use server"

import { createOneUserUsecase } from "../../usecase"


export const CreateOneUser = async () => {
    await createOneUserUsecase.execute({
        cpf: "86643202507", 
        email: "oliveiralauane91@gmail.com", 
        name: "Lauane Oliveira", 
        active: true, 
        image: "", 
        lock: false, 
        profile_id: "", 
        username: "laulau", 
        password_request_token: ""
      })
}