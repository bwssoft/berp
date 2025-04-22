import { WithId } from "mongodb";

export interface PaginationResult<T extends object> {
    docs: WithId<T>[];
    total?: number;
    pages?: number;
    limit?: number;
    totalPages?: number;
}
