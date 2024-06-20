import clientPromise from "./config";
import { Document, WithId } from "mongodb";

type Constructor = {
  collection: string
  db: string
}

export class BaseRepository<Entity extends Document> {
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

  async findOne(params: Partial<Entity>) {
    const db = await this.connect();
    return await db.collection<Entity>(this.collection).findOne(params as Partial<WithId<Entity>>);
  }

  async connect() {
    const client = await clientPromise;
    const db = client.db(this.db);
    return db;
  }
}


