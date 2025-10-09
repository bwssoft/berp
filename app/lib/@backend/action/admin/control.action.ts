"use server";

import { IControl } from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { countControlUsecase } from "../../usecase/admin/control/count.control.usecase";
import { findManyControlUsecase } from "../../usecase/admin/control/find-many-control.usecase";
import { findOneControlUsecase } from "../../usecase/admin/control/find-one-control.usecase";
import { Filter } from "mongodb";

export async function findManyControl(
    filter: Filter<IControl> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    return await findManyControlUsecase.execute({ filter, page, limit, sort });
}

export async function findOneControl(input: Partial<IControl>) {
  return await findOneControlUsecase.execute(input);
}

export async function countControl(input: Filter<IControl>) {
  return await countControlUsecase.execute(input);
}
