export interface IBaseObjectRepository<Entity extends object> {
  create(
    props:
      | { data: Entity | Buffer; key: string; contentType?: string }
      | { data: Entity | Buffer; key: string; contentType?: string }[]
  ): Promise<void>;
  findOne(
    key: string
  ): Promise<{ data: Entity | Buffer; contentType: string } | null>;
  updateOne(key: string, data: Entity | Buffer): Promise<void>;
  deleteOne(key: string): Promise<void>;
  generateUrl(key: string): string;
}
