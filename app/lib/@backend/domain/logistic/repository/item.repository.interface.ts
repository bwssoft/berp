import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IItem } from "@/backend/domain/logistic/entity/item.entity";

export interface IItemRepository extends IBaseRepository<IItem> {}
