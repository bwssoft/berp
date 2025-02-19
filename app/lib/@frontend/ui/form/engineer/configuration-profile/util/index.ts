import { EType } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
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

export const generateConfigurationProfileLinkForClient = async (
  configurationProfileId: string
) => {
  const domain = window.location.origin;
  const link = `${domain}/crm/configuration-profile/form/update?id=${configurationProfileId}`;
  await navigator.clipboard
    .writeText(link)
    .then(() =>
      toast({
        title: "Sucesso!",
        description: "Link gerado com sucesso!",
        variant: "success",
      })
    )
    .catch(() =>
      toast({
        title: "Falha!",
        description: "Falha ao gerar o link!",
        variant: "error",
      })
    );
};
