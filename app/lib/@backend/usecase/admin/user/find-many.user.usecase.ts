import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { userRepository } from "../../../infra/repository/mongodb/admin/user.repository";
import { IUserRepository } from "../../../domain/admin/repository/user.repository.interface";
import { IUser } from "../../../domain/admin/entity/user.definition";
import { RemoveFields } from "../../../decorators/remove-fields";

class FindManyUserUsecase {
  repository: IUserRepository;

  constructor() {
    this.repository = userRepository;
  }

  @RemoveFields("_id", "password")
  async execute(input: Filter<IUser>) {
    return await this.repository.findAll(input);
  }
}

export const findManyUserUsecase = singleton(FindManyUserUsecase);
