import { BaseObjectRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";
import { config } from "@/app/lib/config";

class AccountAttachmentHistoricalObjectRepository extends BaseObjectRepository<Buffer> {
  constructor() {
    super({
      bucket: "s3-berp-bucket",
      prefix: "commercial/account/attachments-historical",
      region: config.AWS_REGION,
      access_key: config.AWS_S3_ACCESS_KEY,
      secret_key: config.AWS_S3_SECRET_KEY,
    });
  }
}

export const accountAttachmentHistoricalObjectRepository = singleton(
  AccountAttachmentHistoricalObjectRepository
);
