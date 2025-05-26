"use server";

import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import { createOneSectorUsecase } from "../../usecase/commercial/sector/create-one.sector.usecase";
import { Filter } from "mongodb";
import { findManySectorUsecase } from "../../usecase/commercial/sector/find-many.sector.usecase";
import { updateOneSectorUsecase } from "../../usecase/commercial/sector/update-one.sector.usecase";
import { revalidatePath } from "next/cache";

type CreateSectorInput = Omit<ISector, "id" | "created_at" | "updated_at">;

export async function createOneSector(data: CreateSectorInput) {
    const sector = await createOneSectorUsecase.execute(data);
    revalidatePath("/commercial/account/form/create", "page");
    return sector;
}

export async function updateOneSector(
    filter: Filter<ISector>,
    update: Partial<ISector>
) {
    const result = await updateOneSectorUsecase.execute(filter, update);
    revalidatePath("/commercial/account/form/create", "page");
    return result;
}
export async function findManySector(
    query: Filter<ISector>
): Promise<ISector[]> {
    return await findManySectorUsecase.execute(query);
}
