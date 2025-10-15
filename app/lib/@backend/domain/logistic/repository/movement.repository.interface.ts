import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IMovement } from "@/backend/domain/logistic/entity/movement.entity";

export interface IMovementRepository extends IBaseRepository<IMovement> {}
