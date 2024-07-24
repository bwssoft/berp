import { IBaseRepository } from "@/app/lib/@backend/domain/@shared/repository/repository.interface";
import clientPromise from "./config";
import { AggregateOptions, AggregationCursor, Filter } from "mongodb";

type Constructor = {
  collection: string
  db: string
}

export class BaseRepository<Entity extends object> implements IBaseRepository<Entity> {
  protected collection: string
  protected db: string

  constructor(args: Constructor) {
    this.collection = args.collection
    this.db = args.db
  }

  async create(data: Entity) {
    const db = await this.connect();
    return await db.collection(this.collection).insertOne(data);
  }

  async createMany(data: Entity[]) {
    const db = await this.connect();
    return await db.collection(this.collection).insertMany(data);
  }

  async findOne(params: Filter<Entity>) {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).findOne(params)
  }

  async findAll() {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).find().toArray();
  }

  async updateOne(query: Filter<Entity>, value: Partial<Entity>) {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).updateOne(query, { $set: value })
  }

  async deleteOne(query: Filter<Entity>) {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).deleteOne(query);
  }

  async aggregate<T extends object>(pipeline?: object[], options?: AggregateOptions): Promise<AggregationCursor<T>> {
    const db = await this.connect();
    return db.collection(this.collection).aggregate<T>(pipeline, options)
  }

  async getDb() {
    const db = await this.connect();
    return db
  }

  async connect() {
    const client = await clientPromise;
    const db = client.db(this.db);
    return db;
  }
}

