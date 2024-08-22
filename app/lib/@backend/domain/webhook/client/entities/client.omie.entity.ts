import { z } from "zod";

export const ClientOmieSchema = z.object({
    bairro: z.string(),
    bloqueado: z.enum(["N", "S", ""]),
    bloquear_faturamento: z.enum([""]).optional(),
    cep: z.string(),
    cidade: z.string(),
    cidade_ibge: z.string(),
    cnae: z.string().optional(),
    cnpj_cpf: z.string(),
    codigo_cliente_integracao: z.string().optional(),
    codigo_cliente_omie: z.number(),
    codigo_pais: z.string(),
    complemento: z.string(),
    contato: z.string(),
    contribuinte: z.string().optional(),
    dadosBancarios: z.object({
        agencia: z.string(),
        codigo_banco: z.string(),
        conta_corrente: z.string(),
        doc_titular: z.string(),
        nome_titular: z.string(),
    }),
    email: z.string(),
    endereco: z.string(),
    endereco_numero: z.string(),
    estado: z.string(),
    exterior: z.enum(["N", "S"]),
    fax_ddd: z.string().optional(),
    fax_numero: z.string().optional(),
    homepage: z.string(),
    inativo: z.enum(["N", "S"]),
    inscricao_estadual: z.string().optional(),
    inscricao_municipal: z.string().optional(),
    inscricao_suframa: z.string().optional(),
    logradouro: z.string().optional(),
    nif: z.string().optional(),
    nome_fantasia: z.string(),
    obs_detalhadas: z.string().optional(),
    observacao: z.string().optional(),
    optante_simples_nacional: z.enum(["N", "S", ""]),
    pessoa_fisica: z.enum(["N", "S", ""]),
    produtor_rural: z.string().optional(),
    razao_social: z.string(),
    recomendacao_atraso: z.string().optional(),
    recomendacoes: z.object({
        codigo_vendedor: z.number(),
        email_fatura: z.string().optional(),
        gerar_boletos: z.enum(["N", "S", ""]),
        numero_parcelas: z.string().optional(),
    }),
    tags: z.array(z.any()),
    telefone1_ddd: z.string(),
    telefone1_numero: z.string(),
    telefone2_ddd: z.string().optional(),
    telefone2_numero: z.string().optional(),
    tipo_atividade: z.string().optional(),
    valor_limite_credito: z.string().optional(),
});

export type ClientOmieEntity = z.infer<typeof ClientOmieSchema>;