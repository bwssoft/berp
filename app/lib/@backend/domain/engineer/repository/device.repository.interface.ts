import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";

export interface IDeviceRepository extends IBaseRepository<IDevice> { }
