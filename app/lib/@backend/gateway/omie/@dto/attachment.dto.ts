export interface IOmieAttachment {
  nPagina: number;
  nTotPaginas: number;
  nRegistros: number;
  nTotRegistros: number;
  listaAnexos: [
    {
      cCodIntAnexo: string;
      cNomeArquivo: string;
      cTabela: "pedido-venda";
      cTipoArquivo: string;
      info: {
        cImpAPI: string;
        dAlt: string;
        dInc: string;
        hAlt: string;
        hInc: string;
        uAlt: string;
        uInc: string;
      };
      nId: string;
      nIdAnexo: number;
    }
  ];
}
