"use server";

import { IAddress } from "@/app/lib/@backend/domain";
import {
    createOneAddressUsecase,
    findManyAddressUsecase,
    findOneAddressUsecase,
} from "@/app/lib/@backend/usecase";
import { Filter } from "mongodb";

export async function createOneAddress(
    address: Omit<IAddress, "id" | "created_at" | "updated_at">
) {
    return await createOneAddressUsecase.execute(address);
}

export async function findManyAddress(
    query: Filter<IAddress>
): Promise<IAddress[]> {
    return await findManyAddressUsecase.execute(query);
}

export async function findOneAddress(query: Partial<IAddress>) {
    return await findOneAddressUsecase.execute(query);
}
