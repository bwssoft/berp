import { OmieEnterprise } from "../@backend/domain";

export const appHashsMapping = {
  [process.env.OMIE_MGC_APP_HASH as string]: OmieEnterprise.MGC,
  [process.env.OMIE_WFC_APP_HASH as string]: OmieEnterprise.WFC,
  [process.env.OMIE_BWS_APP_HASH as string]: OmieEnterprise.BWS,
  [process.env.OMIE_ICB_APP_HASH as string]: OmieEnterprise.ICB,
  [process.env.OMIE_ICBFILIAL_APP_HASH as string]: OmieEnterprise.ICBFILIAL,
};
