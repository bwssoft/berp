import { IBaseRepository } from "@/app/lib/@backend/domain/@shared/repository/repository.interface";
import { AggregateOptions, AggregationCursor, Filter, MongoClient, TransactionOptions, UpdateFilter } from "mongodb";
import clientPromise from "./config";

type Constructor = {
  collection: string;
  db: string;
};

export class BaseRepository<Entity extends object>
  implements IBaseRepository<Entity> {
  protected collection: string;
  protected db: string;

  constructor(args: Constructor) {
    this.collection = args.collection;
    this.db = args.db;
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
    return await db.collection<Entity>(this.collection).findOne(params);
  }

  async findAll(params: Filter<Entity> = {}) {
    const db = await this.connect();
    return await db
      .collection<Entity>(this.collection)
      .find(params)
      .sort({ _id: -1 })
      .limit(50)
      .toArray();
  }

  async updateOne(query: Filter<Entity>, value: UpdateFilter<Entity>) {
    const db = await this.connect();
    return await db
      .collection<Entity>(this.collection)
      .updateOne(query, value);
  }

  async updateMany(query: Filter<Entity>, value: UpdateFilter<Entity>) {
    const db = await this.connect();
    return await db
      .collection<Entity>(this.collection)
      .updateMany(query, value);
  }

  async updateBulk(
    operations: { query: Filter<Entity>; value: UpdateFilter<Entity> }[],
  ) {
    const _operations = operations.map((operation) => {
      const { query, value } = operation;
      return {
        updateMany: {
          filter: query,
          update: value,
        },
      };
    });
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).bulkWrite(_operations);
  }

  async deleteOne(query: Filter<Entity>) {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).deleteOne(query);
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
    const client = await clientPromise; // Conexão com o MongoDB
    const session = client.startSession(); // Inicia a sessão

    try {
      // Use session.withTransaction para gerenciar tudo
      await session.withTransaction(async () => {
        await operations(client); // Passa a sessão para as operações
      }, options)
      await session.commitTransaction()
    } catch (error) {
      console.error("Transaction error:", error);
      throw error; // Repassa o erro para o chamador
    } finally {
      session.endSession(); // Certifique-se de encerrar a sessão
    }
  }




  private async connect() {
    const client = await clientPromise;
    const db = client.db(this.db);
    return db;
  }

}
