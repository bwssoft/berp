import { IProfile } from "@/backend/domain/admin/entity/profile.definition";
import { IProfileRepository } from "@/backend/domain/admin/repository/profile.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { profileRepository } from "@/backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
    export interface Input {
        filter?: Filter<IProfile>;
        page?: number;
        limit?: number;
        sort?: Record<string, 1 | -1>;
    }
    export type Output = PaginationResult<IProfile>;
}

class FindManyProfileUsecase {
    repository: IProfileRepository;

    constructor() {
        this.repository = profileRepository;
    }

    @RemoveMongoId()
    async execute(arg: Dto.Input): Promise<Dto.Output> {
        return await this.repository.findMany(
            arg.filter ?? {},
            arg.limit,
            arg.page,
            arg.sort ?? { name: 1 }
        );
    }
}

export const findManyProfileUsecase = singleton(FindManyProfileUsecase);

