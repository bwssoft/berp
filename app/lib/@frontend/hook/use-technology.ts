import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { useBWS4G } from "./use-bws-4g";
import { useE3Plus } from "./use-e3-plus";
import { useE3Plus4G } from "./use-e3-plus-4g";
import { useLora } from "./use-lora";
import { useNB2 } from "./use-nb-2";
import { useNB2Lora } from "./use-nb-2-lora";

export const useTechnology = (technology: ITechnology | null) => {
  const e3Plus = useE3Plus();
  const e3Plus4G = useE3Plus4G();
  const nb2 = useNB2();
  const lora = useLora();
  const nb2lora = useNB2Lora();
  const bws4g = useBWS4G();

  const {
    name: { system: system_name },
  } = technology ?? { name: { system: "" } };

  switch (system_name) {
    case "DM_E3_PLUS_4G":
      return e3Plus4G;
    case "DM_E3_PLUS":
      return e3Plus;
    case "DM_BWS_NB2":
      return nb2;
    case "DM_BWS_LORA":
      return lora;
    case "DM_BWS_NB2_LORA":
      return nb2lora;
    case "DM_BWS_4G":
      return bws4g;
    default:
      return e3Plus4G;
  }
};
