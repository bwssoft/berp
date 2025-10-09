"use server";

import { Filter } from "mongodb";
import { IEnterprise } from "@/backend/domain/business/entity/enterprise.entity";
import { findManyEnterpriseUsecase } from "../../usecase/business/enterprise/find-many.enterprise.usecase";

export const findManyEnterprise = async (input: {
  filter: Filter<IEnterprise>;
}) => {
  return await findManyEnterpriseUsecase.execute(input);
};
