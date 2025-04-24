import {
    AggregateOptions,
    AggregationCursor,
    BulkWriteResult,
    DeleteResult,
    Filter,
    FindCursor,
    FindOptions,
    InsertManyResult,
    InsertOneResult,
    MongoClient,
    TransactionOptions,
    UpdateFilter,
    UpdateResult,
    WithId,
} from "mongodb";
import { PaginationResult } from "./IPagination.interface";

export interface IBaseRepository<Entity extends object> {
    create(data: Entity): Promise<InsertOneResult<Entity>>;
    createMany(data: Entity[]): Promise<InsertManyResult<Entity>>;
    findOne(
        params: Filter<Entity>,
        options?: FindOptions<Entity>
    ): Promise<Entity | null>;
    findMany(
        params: Filter<Entity>,
        limit?: number,
        page?: number
    ): Promise<PaginationResult<Entity>>;
    count(params: Filter<Entity>): Promise<number>;
    count(params: Filter<Entity>): Promise<number>;
    updateOne(
        query: Filter<Entity>,
        value: UpdateFilter<Entity>
    ): Promise<UpdateResult<Entity>>;
    updateMany(
        query: Filter<Entity>,
        value: UpdateFilter<Entity>
    ): Promise<UpdateResult<Entity>>;
    updateBulk(
        operations: { query: Filter<Entity>; value: UpdateFilter<Entity> }[]
    ): Promise<BulkWriteResult>;
    deleteOne(query: Filter<Entity>): Promise<DeleteResult>;
    aggregate<T extends object>(
        pipeline?: object[],
        options?: AggregateOptions
    ): Promise<AggregationCursor<T>>;
    withTransaction(
        operations: (client: MongoClient) => Promise<void>,
        options?: TransactionOptions
    ): Promise<void>;
    findCursor(filter: Filter<Entity>): Promise<FindCursor<WithId<Entity>>>;
}
