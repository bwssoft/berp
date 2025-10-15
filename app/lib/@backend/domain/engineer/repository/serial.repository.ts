import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ISerial } from "@/backend/domain/engineer/entity/serial.definition";

export interface ISerialRepository extends IBaseRepository<ISerial> {}
