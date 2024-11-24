import { OmieEnterpriseEnum } from "../@backend/domain/@shared/gateway/omie/omie.gateway.interface";

export const appHashsMapping = {
  [process.env.OMIE_MGC_APP_HASH as string]: OmieEnterpriseEnum.MGC,
  [process.env.OMIE_WFC_APP_HASH as string]: OmieEnterpriseEnum.WFC,
  [process.env.OMIE_BWS_APP_HASH as string]: OmieEnterpriseEnum.BWS,
  [process.env.OMIE_ICB_APP_HASH as string]: OmieEnterpriseEnum.ICB,
  [process.env.OMIE_ICBFILIAL_APP_HASH as string]: OmieEnterpriseEnum.ICBFILIAL,
};
