export const appHashsMapping = {
  [process.env.OMIE_MGC_APP_HASH as string]: "MGC",
  [process.env.OMIE_WFC_APP_HASH as string]: "WFC",
  [process.env.OMIE_BWS_APP_HASH as string]: "BWS",
  [process.env.OMIE_ICB_APP_HASH as string]: "ICB",
  [process.env.OMIE_ICBFILIAL_APP_HASH as string]: "ICBFILIAL",
};
