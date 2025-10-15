"use server";

import { IAccountAttachment } from "@/backend/domain/commercial/entity/account-attachment.definition";
import { Filter } from "mongodb";
import { findManyAccountAttachmentUsecase } from "../../usecase/commercial/account-attachment/find-many-account-attachment.usecase";

export async function findManyAccountAttachments(
    filter: Filter<IAccountAttachment> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    return await findManyAccountAttachmentUsecase.execute({ filter, page, limit, sort });
}
