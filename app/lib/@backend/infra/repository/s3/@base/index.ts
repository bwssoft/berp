import { Readable } from "stream";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IBaseObjectRepository } from "@/backend/domain/@shared/repository/object.repository.interface";

type ObjectData<Entity> = {
  data: Entity | Buffer;
  key: string;
  contentType?: string;
};

type BaseObjectRepositoryOptions = {
  bucket: string;
  prefix?: string;
  region: string;
  access_key: string;
  secret_key: string;
};

export abstract class BaseObjectRepository<Entity extends object | Buffer>
  implements IBaseObjectRepository<Entity>
{
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly prefix: string;
  private readonly region: string;

  protected constructor(options: BaseObjectRepositoryOptions) {
    this.bucket = options.bucket;
    this.prefix = options.prefix ?? "";
    this.region = options.region;

    this.client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.access_key,
        secretAccessKey: options.secret_key,
      },
    });
  }

  private resolveKey(key: string) {
    return `${this.prefix}${key}`;
  }

  private async streamToBuffer(stream: Readable | Blob): Promise<Buffer> {
    if (stream instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks);
    }

    if (typeof (stream as Blob).arrayBuffer === "function") {
      const buffer = await (stream as Blob).arrayBuffer();
      return Buffer.from(buffer);
    }

    return Buffer.alloc(0);
  }

  private async putObject(input: ObjectData<Entity>) {
    const body = Buffer.isBuffer(input.data)
      ? input.data
      : Buffer.from(JSON.stringify(input.data));

    const contentType =
      input.contentType ??
      (Buffer.isBuffer(input.data)
        ? "application/octet-stream"
        : "application/json");

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.resolveKey(input.key),
        Body: body,
        ContentType: contentType,
      })
    );
  }

  async create(
    input: ObjectData<Entity> | ObjectData<Entity>[]
  ): Promise<void> {
    const items = Array.isArray(input) ? input : [input];
    await Promise.all(items.map((item) => this.putObject(item)));
  }

  async findOne(
    key: string
  ): Promise<{ data: Entity | Buffer; contentType: string } | null> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.resolveKey(key),
      })
    );

    if (!response.Body) {
      return null;
    }

    const buffer = await this.streamToBuffer(response.Body as Readable);
    const contentType = response.ContentType ?? "application/octet-stream";

    if (
      !Buffer.isBuffer(buffer) ||
      contentType.includes("application/json")
    ) {
      try {
        const parsed = JSON.parse(buffer.toString("utf-8"));
        return {
          data: parsed as Entity,
          contentType,
        };
      } catch {
        return {
          data: buffer,
          contentType,
        };
      }
    }

    return {
      data: buffer,
      contentType,
    };
  }

  async updateOne(key: string, data: Entity | Buffer): Promise<void> {
    await this.putObject({ data, key });
  }

  async deleteOne(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: this.resolveKey(key),
      })
    );
  }

  generateUrl(key: string): string {
    const resolvedKey = this.resolveKey(key);
    const regionSegment = this.region ? `.${this.region}` : "";
    return `https://${this.bucket}.s3${regionSegment}.amazonaws.com/${resolvedKey}`;
  }

  async generateSignedUrl(key: string, expiresIn = 900): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.resolveKey(key),
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}

export { BaseObjectRepository as default };
