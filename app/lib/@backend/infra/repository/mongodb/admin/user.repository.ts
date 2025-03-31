import { IUser } from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super({
            collection: "admin.user",
            db: "berp",
        });
    }
}

export const userRepository = singleton(UserRepository);
