import { IBaseRepository } from "@/app/lib/@backend/domain/@shared/repository/repository.interface";
import {
    AggregateOptions,
    AggregationCursor,
    Filter,
    FindOptions,
    MongoClient,
    Sort,
    TransactionOptions,
    UpdateFilter,
} from "mongodb";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { bCubeClientPromise } from "./b-cube";

type Constructor = {
    collection: string;
    db: string;
    client?: Promise<MongoClient>
};

export class BaseRepository<Entity extends object>
    implements IBaseRepository<Entity>
{
    protected collection: string;
    protected db: string;
    protected client: Promise<MongoClient>

    constructor({ collection, db, client }: Constructor) {
        this.collection = collection;
        this.db = db;
        this.client = client ?? bCubeClientPromise
    }

    async create(data: Entity) {
        const db = await this.connect();
        return db.collection(this.collection).insertOne(data);
    }

    async createMany(data: Entity[]) {
        const db = await this.connect();
        return db.collection(this.collection).insertMany(data);
    }

    async findOne(params: Filter<Entity>, options?: FindOptions<Entity>) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).findOne(params, options);
    }

    async findMany(
        params: Filter<Entity> = {},
        limit = 10,
        page?: number,
        sort: Sort = { _id: -1 }
    ): Promise<PaginationResult<Entity>> {
        const db = await this.connect();

        const totalDocs = await db
            .collection<Entity>(this.collection)
            .countDocuments(params);

        const chain = db
            .collection<Entity>(this.collection)
            .find(params)
            .sort(sort)
            .limit(limit);
        
        if (typeof page === "number") chain.skip((page - 1) * limit);

        const docs = await chain.toArray();

        const totalPages = Math.ceil(totalDocs / limit);
        
        return {
            docs: docs as Entity[],
            total: totalDocs,
            pages: totalPages,
            limit,
        };
    }

    async findCursor(params: Filter<Entity> = {}) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).find(params);
    }

    async count(params: Filter<Entity> = {}) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).countDocuments(params);
    }

    async updateOne(query: Filter<Entity>, value: UpdateFilter<Entity>) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).updateOne(query, value);
    }

    async updateMany(query: Filter<Entity>, value: UpdateFilter<Entity>) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).updateMany(query, value);
    }

    async updateBulk(
        operations: { query: Filter<Entity>; value: UpdateFilter<Entity> }[]
    ) {
        const _operations = operations.map(({ query, value }) => ({
            updateMany: { filter: query, update: value },
        }));
        const db = await this.connect();
        return db.collection<Entity>(this.collection).bulkWrite(_operations);
    }

    async deleteOne(query: Filter<Entity>) {
        const db = await this.connect();
        return db.collection<Entity>(this.collection).deleteOne(query);
    }

    async aggregate<T extends object>(
        pipeline?: object[],
        options?: AggregateOptions
    ): Promise<AggregationCursor<T>> {
        const db = await this.connect();
        return db.collection(this.collection).aggregate<T>(pipeline, options);
    }

    async withTransaction(
        operations: (client: MongoClient) => Promise<void>,
        options: TransactionOptions = {}
    ): Promise<void> {
        const client = await this.client;
        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                await operations(client);
            }, options);
            await session.commitTransaction();
        } finally {
            session.endSession();
        }
    }

    async connect() {
        const client = await this.client;
        return client.db(this.db);
    }
}
