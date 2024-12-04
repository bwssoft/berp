import { OmieBoolean } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { OmieSaleOrderStage } from "../../../domain/@shared/webhook/omie/omie-sale-order.webhook.interface";

interface DET {
  combustivel: object;
  ide: {
    codigo_item: number;
    codigo_item_integracao: string;
    simples_nacional: OmieBoolean;
  };
  imposto: {
    cofins_padrao: {
      aliq_cofins: number;
      base_cofins: number;
      cod_sit_trib_cofins: string;
      qtde_unid_trib_cofins: number;
      tipo_calculo_cofins: string;
      valor_cofins: number;
      valor_unid_trib_cofins: number;
    };
    cofins_st: {
      aliq_cofins_st: number;
      base_cofins_st: number;
      cod_sit_trib_cofins_st: string;
      margem_cofins_st: number;
      qtde_unid_trib_cofins_st: number;
      tipo_calculo_cofins_st: string;
      valor_cofins_st: number;
      valor_unid_trib_cofins_st: number;
    };
    csll: {
      aliq_csll: number;
      valor_csll: number;
    };
    icms: {
      aliq_icms: number;
      base_icms: number;
      cod_sit_trib_icms: string;
      modalidade_icms: string;
      origem_icms: string;
      perc_red_base_icms: number;
      valor_icms: number;
    };
    icms_efet: object;
    icms_ie: {
      aliq_icms_FCP: number;
      aliq_interestadual: number;
      aliq_interna_uf_destino: number;
      aliq_partilha_icms: number;
      base_icms_uf_destino: number;
      valor_fcp_icms_inter: number;
      valor_icms_uf_dest: number;
      valor_icms_uf_remet: number;
    };
    icms_sn: object;
    icms_st: {
      aliq_icms_opprop: number;
      aliq_icms_st: number;
      base_icms_st: number;
      cest: string;
      cod_sit_trib_icms_st: string;
      margem_icms_st: number;
      modalidade_icms_st: string;
      perc_red_base_icms_op: number;
      perc_red_base_icms_st: number;
      valor_icms_st: number;
    };
    inss: {
      aliq_inss: number;
      valor_inss: number;
    };
    ipi: {
      aliq_ipi: number;
      base_ipi: number;
      cod_sit_trib_ipi: string;
      enquadramento_ipi: string;
      qtde_unid_trib_ipi: number;
      tipo_calculo_ipi: string;
      valor_ipi: number;
      valor_unid_trib_ipi: number;
    };
    irrf: {
      aliq_irrf: number;
      valor_irrf: number;
    };
    iss: {
      aliq_iss: number;
      base_iss: number;
      retem_iss: string;
      valor_iss: number;
    };
    pis_padrao: {
      aliq_pis: number;
      base_pis: number;
      cod_sit_trib_pis: string;
      qtde_unid_trib_pis: number;
      tipo_calculo_pis: string;
      valor_pis: number;
      valor_unid_trib_pis: number;
    };
    pis_st: {
      aliq_pis_st: number;
      base_pis_st: number;
      cod_sit_trib_pis_st: string;
      margem_pis_st: number;
      qtde_unid_trib_pis_st: number;
      tipo_calculo_pis_st: string;
      valor_pis_st: number;
      valor_unid_trib_pis_st: number;
    };
  };
  inf_adic: {
    codigo_categoria_item: string;
    codigo_cenario_impostos_item: string;
    codigo_local_estoque: number;
    dados_adicionais_item: string;
    item_pedido_compra: number;
    nao_gerar_financeiro: OmieBoolean;
    nao_movimentar_estoque: OmieBoolean;
    numero_pedido_compra: string;
    peso_bruto: number;
    peso_liquido: number;
  };
  observacao: object;
  produto: {
    cfop: string;
    cnpj_fabricante: string;
    codigo: string;
    codigo_produto: number;
    codigo_tabela_preco: number;
    descricao: string;
    ean: string;
    indicador_escala: string;
    motivo_icms_desonerado: string;
    ncm: string;
    percentual_desconto: number;
    quantidade: number;
    reservado: OmieBoolean;
    tipo_desconto: string;
    unidade: string;
    valor_deducao: number;
    valor_desconto: number;
    valor_icms_desonerado: number;
    valor_mercadoria: number;
    valor_total: number;
    valor_unitario: number;
  };
  rastreabilidade: object;
}

interface Cabecalho {
  codigo_pedido?: number; // Apenas para pesquisa.
  codigo_pedido_integracao: string; // Obrigatório na inclusão/alteração.
  numero_pedido?: string; // Apenas para consulta/pesquisa.
  sequencial?: string; // Apenas para consulta/pesquisa.
  codigo_cliente: number; // Obrigatório.
  codigo_cliente_integracao?: string; // Opcional.
  data_previsao: string; // Obrigatório, formato 'dd/mm/aaaa'.
  quantidade_itens?: number; // Preenchimento automático.
  etapa: string; // Obrigatório, valores fixos como '10', '20', etc.
  codigo_parcela: string; // Obrigatório.
  qtde_parcelas?: number; // Obrigatório apenas se 'codigo_parcela' for '999'.
  origem_pedido?: string; // Opcional, default: 'API'.
  codigo_cenario_impostos?: number; // Opcional, default: cenário padrão.
  tipo_desconto_pedido?: string; // Opcional, valores 'V' ou 'P'.
  perc_desconto_pedido?: number; // Opcional.
  valor_desconto_pedido?: number; // Opcional.
}

interface Frete {
  codigo_transportadora?: number; // ID da transportadora. Opcional.
  codigo_transportadora_integracao?: string; // Código Integração da Transportadora. Opcional.
  modalidade: string; // Tipo de Frete. Obrigatório. Valores: '0', '1', '2', '3', '4', '9'.
  placa?: string; // Placa do veículo. Opcional.
  placa_estado?: string; // Estado da Placa do Veículo. Opcional.
  registro_transportador?: string; // RNTRC (ANTT) - Registro Nacional de Transportador de Cargas. Opcional.
  quantidade_volumes?: number; // Quantidade de Volumes. Opcional.
  especie_volumes?: string; // Espécie dos Volumes. Opcional.
  marca_volumes?: string; // Marca dos Volumes. Opcional.
  numeracao_volumes?: string; // Numeração dos Volumes. Opcional.
  peso_liquido?: number; // Peso Líquido (Kg). Opcional.
  peso_bruto?: number; // Peso Bruto (Kg). Opcional.
  valor_frete?: number; // Valor do Frete. Opcional.
  valor_seguro?: number; // Valor do Seguro. Opcional.
  numero_lacre?: string; // Número do Lacre. Opcional.
  outras_despesas?: number; // Outras Despesas Acessórias. Opcional.
  veiculo_proprio?: string; // O transporte será realizado com veículo próprio. Opcional. Valores: 'S', 'N'.
  previsao_entrega?: string; // Previsão de entrega do Pedido de Venda. Opcional. Formato 'dd/mm/aaaa'.
  codigo_rastreio?: string; // Código de Rastreio da Entrega. Opcional.
  icms_retido?: {
    vServicoTr?: number; // Valor de Serviço de Transporte. Opcional.
    vBCRetencaoTr?: number; // Base de Cálculo da Retenção. Opcional.
    vAliquotaRetencaoTr?: number; // Percentual de Alíquota de Retenção. Opcional.
    vIcmsRetidoTr?: number; // Valor de ICMS Retido. Opcional.
    cCfopTr?: string; // CFOP. Opcional.
    cCidadeTr?: string; // Cidade de Ocorrência do Fato Gerador do ICMS. Opcional. Formato: "CIDADE (UF)".
  }; // Dados do ICMS Retido do Serviço de Transporte. Opcional. Interface separada.
  codigo_tipo_entrega?: number; // Código do tipo de entrega. Opcional.
}

interface InformacoesAdicionais {
  codigo_categoria: string; // Código da categoria. Obrigatório.
  codigo_conta_corrente: number; // Código da Conta Corrente. Obrigatório.
  numero_pedido_cliente?: string; // Número do pedido do cliente. Opcional.
  numero_contrato?: string; // Número do Contrato de Venda. Opcional.
  contato?: string; // Contato. Opcional.
  dados_adicionais_nf?: string; // Dados adicionais para a Nota Fiscal. Opcional. Use '|' como separador de linhas.
  consumidor_final: string; // Nota Fiscal para Consumo Final. Obrigatório. Valores: 'S', 'N'.
  utilizar_emails: string; // Lista de e-mails que receberão a Nota Fiscal. Obrigatório. Use ',' como separador.
  enviar_email?: string; // Enviar e-mail com o boleto. Opcional. Valores: 'S', 'N'. Default: 'N'.
  enviar_pix?: string; // Enviar e-mail com o PIX. Opcional. Valores: 'S', 'N'. Default: 'N'.
  codVend?: number; // Código do Vendedor. Opcional.
  codProj?: number; // Código do Projeto. Opcional.
  outros_detalhes?: {
    cNatOperacaoOd?: string; // Natureza da Operação. Opcional.
    cIndicadorOd?: string; // Indicador de Presença da Operação. Opcional. Valores: '1', '2', '3', '4', '5', '9'.
    cIndicadorIntOd?: string; // Indicador de Intermediador. Opcional. Valores: '0', '1'.
    cCnpjIntOd?: string; // CNPJ do Intermediador. Obrigatório se cIndicadorIntOd for '1'.
    cIdentificadorIntOd?: string; // Identificação no Intermediador. Obrigatório se cIndicadorIntOd for '1'.
    dDataSaidaOd?: string; // Data de Saída. Opcional. Formato: 'dd/mm/aaaa'.
    cHoraSaidaOd?: string; // Hora de Saída. Opcional. Formato: 'hh:mm:ss'.
    cCnpjCpfOd?: string; // CNPJ/CPF (do recebedor). Opcional.
    cNomeOd?: string; // Nome/Razão Social. Opcional.
    cInscrEstadualOd?: string; // Inscrição Estadual. Opcional.
    cEnderecoOd?: string; // Endereço. Opcional.
    cNumeroOd?: string; // Número do endereço. Opcional.
    cComplementoOd?: string; // Complemento do endereço. Opcional.
    cBairroOd?: string; // Bairro. Opcional.
    cEstadoOd?: string; // Estado. Opcional.
    cCidadeOd?: string; // Cidade. Opcional. Formato: 'CIDADE (UF)'.
    cCEPOd?: string; // CEP. Opcional.
    cSepararEnderecoOd?: string; // Separar endereço. Opcional. Valores: 'S', 'N'. Default: 'N'.
    cTelefoneOd?: string; // Telefone. Opcional.
    cCnpjCpfOdRet?: string; // CPF/CNPJ (Local de Retirada). Opcional.
    cNomeOdRet?: string; // Nome/Razão Social (Local de Retirada). Opcional.
    cInscrEstadualOdRet?: string; // Inscrição Estadual (Local de Retirada). Opcional.
    cEnderecoOdRet?: string; // Endereço (Local de Retirada). Opcional.
    cNumeroOdRet?: string; // Número do endereço (Local de Retirada). Opcional.
    cComplementoOdRet?: string; // Complemento do endereço (Local de Retirada). Opcional.
    cBairroOdRet?: string; // Bairro (Local de Retirada). Opcional.
    cEstadoOdRet?: string; // Estado (Local de Retirada). Opcional.
    cCidadeOdRet?: string; // Cidade (Local de Retirada). Opcional. Formato: 'CIDADE (UF)'.
    cCEPOdRet?: string; // CEP (Local de Retirada). Opcional.
    cSepararEnderecoOdRet?: string; // Separar endereço (Local de Retirada). Opcional. Valores: 'S', 'N'. Default: 'N'.
    cTelefoneOdRet?: string; // Telefone (Local de Retirada). Opcional.
  }; // Outros detalhes da NF-e. Opcional. Subinterface.
  impostos_embutidos?: string; // **DEPRECATED**
  meio_pagamento?: string; // Meio de Pagamento. Opcional. Valores: '01', '02', ..., '99'.
  descr_meio_pagamento?: string; // Descrição do Meio de Pagamento. Opcional. Requerido se 'meio_pagamento' for '99'.
  tipo_documento?: string; // Tipo de Documento. Opcional.
  nfRelacionada?: {
    cChaveRef?: string; // Chave da NF-e (ou NFC-e ou SAT) Relacionada. Opcional.
    nNFRef?: string; // Número da Nota Fiscal relacionada (Modelo 1/1A). Opcional.
    cSerieRef?: string; // Série da NF Referenciada (Modelo 1/1A). Opcional.
    dtEmissaoRef?: string; // Data de emissão da NF Referenciada (Modelo 1/1A). Opcional. Formato 'dd/mm/aaaa'.
    cnpjEmitRef?: string; // CNPJ do Emitente da NF Referenciada (Modelo 1/1A). Opcional.
    cUfRef?: string; // Estado do Emitente da NF Referenciada (Modelo 1/1A). Opcional.
    nNfPR?: string; // Número da Nota Fiscal relacionada do Produtor Rural. Opcional.
    cSeriePR?: string; // Série da NF do Produtor Rural. Opcional.
    dtEmissaoPR?: string; // Data de emissão da NF do Produtor Rural. Opcional. Formato 'dd/mm/aaaa'.
    cnpjPR?: string; // CNPJ/CPF do Produtor Rural. Opcional.
    InscrEstPR?: string; // Inscrição Estadual do Produtor Rural. Opcional.
    cUfPR?: string; // Estado do Produtor Rural. Opcional.
    nCOORef?: string; // Número do COO - Contador de Ordem de Operação. Opcional.
    nECFRef?: string; // Número de Ordem Sequencial do ECF. Opcional.
    indPresenca?: string; // Indicador de Presença da Operação. Opcional. Valores: '1', '2', '3', '4', '5', '9'.
    indIntermediario?: string; // Indicador de Intermediador. Opcional. Valores: '0', '1'.
    cnpjIntermediario?: string; // CNPJ do Intermediador. Obrigatório se indIntermediario for '1'.
    identIntermediario?: string; // Identificação no Intermediador. Obrigatório se indIntermediario for '1'.
    nrProdutorRural?: any[]; // Outras notas de produtor rural relacionadas. Opcional.
    nrNF?: any[]; // Outras NF-e, NFC-e ou SAT relacionadas. Opcional.
    nrCupomFiscal?: any[]; // Outros cupons fiscais relacionados. Opcional.
    nrModelo1_1A?: any[]; // Outras notas modelo 1/1A relacionadas. Opcional.
    cSigNFRef?: string; // Manter o sigilo da NF-e referenciada. Opcional. Valores: 'S', 'N'. Default: 'N'.
  }; // Detalhes da NF referenciada. Opcional. Subinterface.
  nsu?: string; // Número Sequencial Único NSU. Opcional.
}

interface Parcela {
  numero_parcela: number; // Número da Parcela. Obrigatório.
  valor: number; // Valor do Documento. Obrigatório.
  percentual: number; // Percentual da Parcela. Obrigatório.
  data_vencimento: string; // Data do documento. Obrigatório. Formato 'dd/mm/aaaa'.
  quantidade_dias?: number; // Quantidade de dias até o vencimento da parcela. Opcional.
  tipo_documento?: string; // Tipo de Documento. Opcional.
  meio_pagamento?: string; // Meio de Pagamento. Opcional. Valores: '01', '02', ..., '99'.
  descr_meio_pagamento?: string; // Descrição do Meio de Pagamento. Obrigatório se meio_pagamento for '99'.
  nsu?: string; // Número Sequencial Único NSU. Opcional.
  nao_gerar_boleto?: string; // Não gerar boleto para esta parcela. Opcional. Valores: 'S', 'N'. Default: 'N'.
  parcela_adiantamento?: string; // Indica se é uma parcela de Adiantamento. Opcional. Valores: 'S', 'N'. Default: 'N'.
  categoria_adiantamento?: string; // Código da Categoria para o Adiantamento. Opcional.
  conta_corrente_adiantamento?: number; // Conta Corrente de Adiantamento. Opcional.
}


export interface IncluirPedidoVendaProduto {
  cabecalho: Cabecalho
  frete?: Frete
  informacoes_adicionais: InformacoesAdicionais
  lista_parcelas: { parcelas: Parcela[] }
}

export interface IOmieSaleOrder {
  pedido_venda_produto: {
    cabecalho: {
      bloqueado: OmieBoolean;
      codigo_cenario_impostos: string;
      codigo_cliente: number;
      codigo_parcela: string;
      codigo_pedido: number;
      data_previsao: string;
      etapa: OmieSaleOrderStage;
      numero_pedido: string;
      origem_pedido: string;
      qtde_parcelas: number;
      quantidade_itens: number;
    };
    det: DET[];
    exportacao: {
      nao_exportacao: OmieBoolean;
    };
    frete: {
      modalidade: string;
      peso_bruto: number;
      peso_liquido: number;
    };
    infoCadastro: {
      autorizado: OmieBoolean;
      cImpAPI: OmieBoolean;
      cancelado: OmieBoolean;
      dAlt: string;
      dInc: string;
      denegado: OmieBoolean;
      devolvido: OmieBoolean;
      devolvido_parcial: OmieBoolean;
      faturado: OmieBoolean;
      hAlt: string;
      hInc: string;
      uAlt: string;
      uInc: string;
    };
    informacoes_adicionais: {
      codigo_categoria: string;
      codigo_conta_corrente: number;
      consumidor_final: OmieBoolean;
      enviar_email: OmieBoolean;
      enviar_pix: OmieBoolean;
      utilizar_emails: string;
    };
    lista_parcelas: {
      parcela: [
        {
          data_vencimento: string;
          numero_parcela: number;
          percentual: number;
          quantidade_dias: number;
          valor: number;
        }
      ];
    };
    observacoes: {
      obs_venda: string;
    };
    total_pedido: {
      valor_mercadorias: number;
      valor_total_pedido: number;
    };
  };
}
