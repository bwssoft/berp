"use server";

import { Filter } from "mongodb";
import { IEnterprise } from "../../domain";
import { findManyEnterpriseUsecase } from "../../usecase/business/enterprise/find-many.enterprise.usecase";

export const findManyEnterprise = async (input: {
  filter: Filter<IEnterprise>;
}) => {
  return await findManyEnterpriseUsecase.execute(input);
};
