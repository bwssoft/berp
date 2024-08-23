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
