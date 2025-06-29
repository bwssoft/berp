import { EType } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { configurationProfileConstants } from "@/app/lib/constant";
import { z } from "zod";

export const formatConfigurationProfileName = (props: {
  type?: string;
  technology?: string;
  document?: string;
}) => {
  const { type, technology, document } = props;
  const typeFormatted = type
    ? configurationProfileConstants.type[type as EType]
    : "__";
  const technologyFormatted = technology ?? "__";
  const documentFormatted = document ?? "__";
  return `${technologyFormatted}.${typeFormatted}.${documentFormatted}`.toUpperCase();
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
