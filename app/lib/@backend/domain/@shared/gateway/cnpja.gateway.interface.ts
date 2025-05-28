export interface ICnpjaResponse {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral?: number;
  nome_cidade_exterior?: string;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  ddd_fax?: string;
  correio_eletronico?: string;
  situacao_especial?: string;
  data_situacao_especial?: string;
  capital_social: number;
  porte_empresa: string;
  simples?: {
    simples: string;
    data_opcao_simples?: string;
    data_exclusao_simples?: string;
    mei: string;
    data_opcao_mei?: string;
    data_exclusao_mei?: string;
  };
  socios?: Array<{
    nome_socio: string;
    cpf_cnpj_socio: string;
    codigo_qualificacao_socio: number;
    qualificacao_socio: string;
    data_entrada_sociedade: string;
    codigo_pais: number;
    pais: string;
    representante_legal?: {
      nome_representante: string;
      cpf_representante: string;
      codigo_qualificacao_representante: number;
      qualificacao_representante: string;
    };
  }>;
  cnaes_secundarios?: Array<{
    codigo: number;
    descricao: string;
  }>;
  inscricoes_estaduais?: Array<{
    inscricao_estadual: string;
    ativo: boolean;
    atualizado_em: string;
    estado: {
      uf: string;
      nome: string;
    };
  }>;
}

export interface ICnpjaGateway {
  getCnpjData(cnpj: string): Promise<ICnpjaResponse | null>;
}
