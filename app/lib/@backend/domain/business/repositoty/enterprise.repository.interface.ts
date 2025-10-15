import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IEnterprise } from "@/backend/domain/business/entity/enterprise.entity";

export interface IEnterpriseRepository extends IBaseRepository<IEnterprise> {}
