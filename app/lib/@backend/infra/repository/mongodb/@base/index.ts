import {
  type AggregateOptions,
  type AggregationCursor,
  type BulkWriteResult,
  type Db,
  type DeleteResult,
  type Filter,
  type FindCursor,
  type FindOptions,
  type InsertManyResult,
  type InsertOneResult,
  type MongoClient,
  type TransactionOptions,
  type UpdateFilter,
  type UpdateResult,
  type OptionalUnlessRequiredId,
  type WithId,
} from "mongodb";
import type { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import type { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { bCubeClientPromise } from "./b-cube";
import { bSerialClientPromise } from "./b-serial";

type BaseRepositoryOptions = {
  collection: string;
  db: string;
};

export abstract class BaseRepository<Entity extends object>
  implements IBaseRepository<Entity>
{
  private readonly collectionName: string;
  private readonly databaseName: string;

  protected constructor(options: BaseRepositoryOptions) {
    this.collectionName = options.collection;
    this.databaseName = options.db;
  }

  protected async getClient(): Promise<MongoClient> {
    if (this.databaseName === "b-serial") {
      return bSerialClientPromise;
    }

    return bCubeClientPromise;
  }

  protected async getDatabase(): Promise<Db> {
    const client = await this.getClient();
    const database =
      this.databaseName === "b-serial"
        ? this.databaseName
        : this.databaseName || "berp";
    return client.db(database);
  }

  protected async getCollection() {
    const db = await this.getDatabase();
    return db.collection<Entity>(this.collectionName);
  }

  async create(data: Entity): Promise<InsertOneResult<Entity>> {
    const collection = await this.getCollection();
    return collection.insertOne(
      data as OptionalUnlessRequiredId<Entity>
    );
  }

  async createMany(data: Entity[]): Promise<InsertManyResult<Entity>> {
    const collection = await this.getCollection();
    return collection.insertMany(
      data as OptionalUnlessRequiredId<Entity>[]
    );
  }

  async findOne(
    params: Filter<Entity>,
    options?: FindOptions<Entity>
  ): Promise<Entity | null> {
    const collection = await this.getCollection();
    const result = await collection.findOne(params, options);
    if (!result) {
      return null;
    }

    // Remove the Mongo internal identifier to keep domain entities clean
    const { _id, ...rest } = result as WithId<Entity> & Record<string, unknown>;
    return rest as Entity;
  }

  async findMany(
    params: Filter<Entity>,
    limit = 10,
    page = 1,
    sort?: Record<string, 1 | -1>
  ): Promise<PaginationResult<Entity>> {
    const collection = await this.getCollection();
    const cursor = collection
      .find(params, {
        ...(sort ? { sort } : {}),
      })
      .skip(limit > 0 ? (page - 1) * limit : 0)
      .limit(limit);

    const rawDocs = (await cursor.toArray()) as WithId<Entity>[];
    const docs = rawDocs.map(({ _id, ...doc }) => doc as Entity);
    const total = await collection.countDocuments(params);
    const pages = limit > 0 ? Math.ceil(total / limit) : 1;

    return {
      docs,
      total,
      pages,
      limit,
    };
  }

  async count(params: Filter<Entity>): Promise<number> {
    const collection = await this.getCollection();
    return collection.countDocuments(params);
  }

  async updateOne(
    query: Filter<Entity>,
    value: UpdateFilter<Entity>
  ): Promise<UpdateResult<Entity>> {
    const collection = await this.getCollection();
    return collection.updateOne(query, value);
  }

  async upsertOne(
    query: Filter<Entity>,
    value: UpdateFilter<Entity>
  ): Promise<UpdateResult<Entity>> {
    const collection = await this.getCollection();
    return collection.updateOne(query, value, { upsert: true });
  }

  async updateMany(
    query: Filter<Entity>,
    value: UpdateFilter<Entity>
  ): Promise<UpdateResult<Entity>> {
    const collection = await this.getCollection();
    return collection.updateMany(query, value);
  }

  async updateBulk(
    operations: {
      filter: Filter<Entity>;
      update: UpdateFilter<Entity>;
      upsert: boolean;
    }[]
  ): Promise<BulkWriteResult> {
    const collection = await this.getCollection();
    return collection.bulkWrite(
      operations.map((operation) => ({
        updateOne: {
          filter: operation.filter,
          update: operation.update,
          upsert: operation.upsert,
        },
      }))
    );
  }

  async deleteOne(query: Filter<Entity>): Promise<DeleteResult> {
    const collection = await this.getCollection();
    return collection.deleteOne(query);
  }

  async deleteMany(query: Filter<Entity>): Promise<DeleteResult> {
    const collection = await this.getCollection();
    return collection.deleteMany(query);
  }

  async aggregate<T extends object>(
    pipeline: object[] = [],
    options?: AggregateOptions
  ): Promise<AggregationCursor<T>> {
    const collection = await this.getCollection();
    return collection.aggregate<T>(pipeline, options);
  }

  async withTransaction(
    operations: (client: MongoClient) => Promise<void>,
    options?: TransactionOptions
  ): Promise<void> {
    const client = await this.getClient();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await operations(client);
      }, options);
    } finally {
      await session.endSession();
    }
  }

  async findCursor(
    filter: Filter<Entity>
  ): Promise<FindCursor<WithId<Entity>>> {
    const db = await this.getDatabase();
    return db.collection<Entity>(this.collectionName).find(filter);
  }
}

export { BaseRepository as default };
