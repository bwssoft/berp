import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getContentType } from "@/app/lib/util/get-content-type";
import { IBaseObjectRepository } from "@/app/lib/@backend/domain/@shared/repository/object.repository.interface";

type Constructor = {
  bucket: string;
  prefix: string;
  region: string;
  access_key: string;
  secret_key: string;
};

export class BaseObjectRepository<Entity extends object>
  implements IBaseObjectRepository<Entity> {
  private bucket: string;
  private prefix: string;
  private region: string;
  private client: S3Client;

  constructor(args: Constructor) {
    this.bucket = args.bucket;
    this.prefix = args.prefix;
    this.region = args.region;
    this.client = new S3Client({
      region: args.region,
      credentials: {
        accessKeyId: args.access_key,
        secretAccessKey: args.secret_key,
      },
    });
  }

  private getKey(id: string) {
    return `${this.prefix}${id}`;
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  generateUrl(key: string) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async create(
    props: { data: Entity | Buffer; key: string; contentType?: string } | { data: Entity | Buffer; key: string; contentType?: string }[]
  ) {
    // Ensure props is always an array
    const items = Array.isArray(props) ? props : [props];

    // Helper function to create a single item
    const uploadSingleItem = async ({ data, key: _key, contentType: customContentType }: { data: Entity | Buffer; key: string; contentType?: string }) => {
      const key = this.getKey(_key);
      const isJson = typeof data === "object" && !(data instanceof Buffer);
      const body = isJson ? JSON.stringify(data) : data;
      
      // Use provided content type or detect from key/data
      const contentType = customContentType || getContentType(key);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      await this.client.send(command);
    };

    // Executar uploads em paralelo
    try {
      await Promise.all(items.map((item) => uploadSingleItem(item)));
    } catch (error) {
      throw new Error("Failed to create one or more objects in S3.");
    }
  }


  async findOne(key: string): Promise<{ data: Entity | Buffer; contentType: string } | null> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.getKey(key),
    });

    try {
      const response = await this.client.send(command);
      const body = response.Body as Readable;
      const contentType = response.ContentType || "application/octet-stream";
      const buffer = await this.streamToBuffer(body);

      if (contentType === "application/json") {
        const json = JSON.parse(buffer.toString("utf-8"));
        return { data: json as Entity, contentType };
      }

      return { data: buffer, contentType };
    } catch (err) {
      if ((err as any).$metadata?.httpStatusCode === 404) {
        console.warn("Object not found:", key);
        return null; // Objeto não encontrado
      }
      console.error("Error fetching object:", err);
      throw new Error("Failed to fetch object from S3.");
    }
  }

  async updateOne(key: string, data: Entity | Buffer) {
    try {
      const existing = await this.findOne(key);
      if (!existing) {
        throw new Error("Object not found");
      }

      const isJson = typeof data === "object" && !(data instanceof Buffer);
      const body = isJson ? JSON.stringify(data) : data;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: existing.contentType,
      });

      await this.client.send(command);
    } catch (error) {
      console.error("Error updating object:", error);
      throw new Error("Failed to update object in S3.");
    }
  }

  async deleteOne(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: this.getKey(key),
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new Error("Failed to delete object from S3.");
    }
  }
}
