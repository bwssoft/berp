import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IRequestToUpdate } from "@/backend/domain/engineer/entity/request-to-update-firmware.definition";

export interface IRequestToUpdateRepository extends IBaseRepository<IRequestToUpdate> { }
