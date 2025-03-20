import { ITechnology } from "../../@backend/domain";
import { useE3Plus } from "./use-e3-plus";
import { useE3Plus4G } from "./use-e3-plus-4g";
import { useNB2 } from "./use-nb-2";

export const useTechnology = (technology: ITechnology | null) => {
  const e3Plus = useE3Plus();
  const e3Plus4G = useE3Plus4G();
  const nb2 = useNB2();
  if (technology?.name.system === "DM_E3_PLUS_4G") {
    return e3Plus4G;
  } else if (technology?.name.system === "DM_E3_PLUS") {
    return e3Plus;
  } else if (technology?.name.system === "DM_NB_2") {
    return nb2;
  } else {
    return e3Plus4G;
  }
};
