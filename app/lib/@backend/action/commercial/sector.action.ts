"use server";

import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import { createOneSectorUsecase } from "../../usecase/commercial/sector/create-one.sector.usecase";
import { Filter } from "mongodb";
import { findManySectorUsecase } from "../../usecase/commercial/sector/find-many.sector.usecase";

type CreateSectorInput = Omit<ISector, "id" | "created_at" | "updated_at">;

export async function createOneSector(data: CreateSectorInput) {
    return await createOneSectorUsecase.execute(data);
}

export async function findManySector(
    query: Filter<ISector>
): Promise<ISector[]> {
    return await findManySectorUsecase.execute(query);
}
