import { AggregateOptions, AggregationCursor, DeleteResult, Filter, InsertManyResult, InsertOneResult, UpdateResult, WithId } from "mongodb";

export interface IBaseRepository<Entity extends object> {
  create(data: Entity): Promise<InsertOneResult<Entity>>;
  createMany(data: Entity[]): Promise<InsertManyResult<Entity>>;
  findOne(params: Filter<Entity>): Promise<WithId<Entity> | null>;
  findAll(): Promise<WithId<Entity>[]>;
  updateOne(query: Filter<Entity>, value: Partial<Entity>): Promise<UpdateResult<Entity>>;
  deleteOne(query: Filter<Entity>): Promise<DeleteResult>;
  aggregate<T extends object>(pipeline?: object[], options?: AggregateOptions): Promise<AggregationCursor<T>>;
  getDb(): Promise<any>;
}

