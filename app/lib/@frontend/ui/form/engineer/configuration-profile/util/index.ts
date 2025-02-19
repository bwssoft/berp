import { EType } from "@/app/lib/@backend/domain";
import { configurationProfileConstants } from "@/app/lib/constant";
import { z } from "zod";

export const emptyStringToUndefined = (val: unknown) =>
  val === "" ? undefined : val;
export const optionalString = z.preprocess(
  emptyStringToUndefined,
  z.string().optional()
);
export const optionalNumber = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().optional()
);
export const formatConfigurationProfileName = (props: {
  type?: string;
  technology?: string;
  document?: string;
}) => {
  const { type, technology, document } = props;
  const typeFormatted = type
    ? configurationProfileConstants.type[type as EType]
    : "Unknown";
  const technologyFormatted = technology ?? "Unknown";
  const documentFormatted = document ?? "Unknown";
  return `CONFIG.${documentFormatted}.${technologyFormatted}.${typeFormatted}`.toUpperCase();
};
