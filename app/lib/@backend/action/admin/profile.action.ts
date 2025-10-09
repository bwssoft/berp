"use server";

import { IProfile } from "@/app/lib/@backend/domain/admin/entity/profile.definition";
import { activeProfileUsecase } from "../../usecase/admin/profile/active.profile.usecase";
import { createOneProfileUsecase } from "../../usecase/admin/profile/create-one.profile.usecase";
import { findManyProfileUsecase } from "../../usecase/admin/profile/find-many.profile.usecase";
import { findOneProfileUsecase } from "../../usecase/admin/profile/find-one.profile.usecase";
import { setLockedControlProfileUsecase } from "../../usecase/admin/profile/set-locked-control.profile.usecase";
import { Filter } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOneProfile(
    input: Omit<IProfile, "id" | "created_at">
) {
    const result = await createOneProfileUsecase.execute(input);
    revalidatePath("/admin/profile");
    return result;
}

export async function findManyProfile(
    filter: Filter<IProfile> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    const result = await findManyProfileUsecase.execute({ filter, page, limit, sort });
    return result;
}

export async function findOneProfile(input: Filter<IProfile>) {
    try {
        const result = await findOneProfileUsecase.execute(input);
        if (!result) {
            return null;
        }
        return result;
    } catch (error) {
        console.error("Error in findOneProfile:", error);
        throw error instanceof Error 
            ? error 
            : new Error("An unexpected error occurred while fetching the profile");
    }
}

export async function setLockedControl(input: {
    id: string;
    locked_control_code: string[];
    operation: "add" | "remove";
    control_name: string;
}) {
    try {
        const result = await setLockedControlProfileUsecase.execute(input);
        
        // Revalidate both control and profile paths to ensure the UI updates correctly
        revalidatePath("/admin/control");
        revalidatePath("/admin/profile");
        
        if (!result.success) {
            throw new Error(result.error || "Failed to update permissions");
        }
        
        return result;
    } catch (error) {
        console.error("Error in setLockedControl:", error);
        throw error instanceof Error 
            ? error 
            : new Error("An unexpected error occurred while updating permissions");
    }
}

export async function activeProfile(input: { id: string; active: boolean }) {
    const result = await activeProfileUsecase.execute(input);
    revalidatePath("/admin/profile");
    revalidatePath("/admin/control");
    return result;
}
