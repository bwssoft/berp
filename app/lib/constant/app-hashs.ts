import { OmieEnterpriseEnum } from "@/backend/domain/@shared/gateway/omie.gateway.interface";

export const appHashsMapping = {
  [process.env.OMIE_MGC_APP_HASH as string]: OmieEnterpriseEnum.MGC,
  [process.env.OMIE_WFC_APP_HASH as string]: OmieEnterpriseEnum.WFC,
  [process.env.OMIE_BWS_APP_HASH as string]: OmieEnterpriseEnum.BWS,
  [process.env.OMIE_ICB_APP_HASH as string]: OmieEnterpriseEnum.ICB,
  [process.env.OMIE_ICBFSP_APP_HASH as string]: OmieEnterpriseEnum.ICBFSP,
};


// Categoria
// ICB | Contrato Comodato | 1.01.99
// WFC | Clientes - Revenda de Mercadoria | 1.01.03
// MGC | Clientes - Venda de Mercadoria Fabricadas | 1.01.01

export const orderCategory = {
  [OmieEnterpriseEnum.ICB]: "1.01.99", // Contrato Comodato
  [OmieEnterpriseEnum.WFC]: "1.01.03", // Clientes - Revenda de Mercadoria
  [OmieEnterpriseEnum.MGC]: "1.01.01", // Clientes - Venda de Mercadoria Fabricadas
  [OmieEnterpriseEnum.HYB]: "", // --
  [OmieEnterpriseEnum.BWS]: "", // --
  [OmieEnterpriseEnum.ICBFSP]: "", // --
}

// Conta corrente
// ICB | Banco do Brasil | 409460317
// WFC | Banco do Brasil | 3301311923
// MGC | Banco do Brasil | 5620909053

export const account = {
  [OmieEnterpriseEnum.ICB]: 409460317, // Banco do Brasil
  [OmieEnterpriseEnum.WFC]: 3301311923, // Banco do Brasil
  [OmieEnterpriseEnum.MGC]: 5620909053, // Banco do Brasil
  [OmieEnterpriseEnum.HYB]: 0, // --
  [OmieEnterpriseEnum.BWS]: 0, // --
  [OmieEnterpriseEnum.ICBFSP]: 0 // --
}
