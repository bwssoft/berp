import { WithId } from "mongodb";

export interface PaginationResult<T extends object> {
    docs: WithId<T>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
