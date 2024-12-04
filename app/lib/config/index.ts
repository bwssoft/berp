import { z } from "zod";
import { OmieEnterpriseEnum } from "../@backend/domain/@shared/gateway/omie/omie.gateway.interface";

const OmieSecretSchema = z.object({
  key: z.string(),
  secret: z.string(),
});

const EnviromentsSchema = z.object({
  OMIE_SECRETS: z.record(
    z.nativeEnum(OmieEnterpriseEnum),
    OmieSecretSchema
  ),
  OMIE_URL: z.string(),
  FIREBASE_CONFIG: z.any(),
  AWS_REGION: z.string(),
  AWS_S3_ACCESS_KEY: z.string(),
  AWS_S3_SECRET_KEY: z.string(),
});

export const config = EnviromentsSchema.parse({
  FIREBASE_CONFIG:
    (process.env.FIREBASE_CONFIG &&
      JSON.parse(process.env.FIREBASE_CONFIG as string)) ||
    "",
  MONGO_URI: process.env.MONGODB_URI || "",
  OMIE_URL: process.env.NEXT_PUBLIC_OMIE_URL,
  OMIE_SECRETS: {
    MGC: {
      key: process.env.OMIE_MGC_API_KEY,
      secret: process.env.OMIE_MGC_API_SECRET,
    },
    WFC: {
      key: process.env.OMIE_WFC_API_KEY,
      secret: process.env.OMIE_WFC_API_SECRET,
    },
    BWS: {
      key: process.env.OMIE_BWS_API_KEY,
      secret: process.env.OMIE_BWS_API_SECRET,
    },
    ICB: {
      key: process.env.OMIE_ICB_API_KEY,
      secret: process.env.OMIE_ICB_API_SECRET,
    },
    ICBFILIAL: {
      key: process.env.OMIE_ICBFILIAL_API_KEY,
      secret: process.env.OMIE_ICBFILIAL_API_SECRET,
    },
  },
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
});
