export interface PaginationResult<T extends object> {
    docs: T[];
    total?: number;
    pages?: number;
    limit?: number;
}
