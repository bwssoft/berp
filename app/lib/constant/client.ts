import { IClient, IProposal } from "../@backend/domain";

const types = {
  prospect: "Prospecção",
  inactive_registration: "Cadastro Inativo",
  active_client: "Cliente Ativo",
  suspended_client: "Cliente Suspenso Financeiro",
  deregistered_cnpj: "CNPJ Baixado",
  inactive_cnpj: "CNPJ Inapto",
  dealer: "Revendedor",
  other: "Outro"
};

const sector: {[key in IClient["sector"]]: string} = {
  vehicle_protection_association: "Associação Prot. Veicular",
  retail_trade: "Comércio Varejista",
  tracking_company: "Empresa de Rastreamento",
  service_company: "Empresa de Serviços",
  vehicle_protection_manager: "Gestora Prot. Veicular",
  industry: "Indústria",
  integrator_ti: "Integradora (TI)",
  rental_company: "Locadora",
  logistics: "Logística",
  iot_tracking_platform: "Plataforma IOT/Rastreamento",
  resale: "Revenda",
  insurance_company: "Seguradora",
  patrimonial_security: "Segurança Patrimonial",
  carrier: "Transportadora",
  other: "Outro"
};

const contactRole: {[key in IClient["contacts"][0]["role"]]: string} = {
  analyst: "Analista",
  supervisor: "Supervisor",
  manager: "Gerente",
  director: "Diretor",
  president: "Presidente",
  owner: "Proprietário",
  other: "Outro"
};

const contactDepartment: {[key in IClient["contacts"][0]["department"]]: string} = {
  administrative: "Administrativo",
  commercial: "Comercial",
  purchasing: "Compras",
  financial: "Financeiro",
  logistics: "Logística",
  operations: "Operações",
  presidency: "Presidência",
  product: "Produto",
  owner: "Proprietário",
  support: "Suporte",
  other: "Outro"
};


const opportunitySalesStage = {
  initial_contact: "Contato Inicial",
  under_review: "Em Análise",
  proposal_sent: "Proposta Enviada",
  in_negotiation: "Em Negociação",
  sale_won: "Venda Ganha",
  sale_lost: "Venda Perdida",
  stopped: "Parada"
};

const opportunityType = {
  existing_business: "Negócio Existente",
  new_business: "Novo Negócio"
};

const opportunityRecurrenceType = {
  monthly: "Mensal",
  annual: "Anual",
  one_time_sale: "Venda Única"
};

const proposalCurrency: { [key in IProposal["scenarios"][number]["currency"]]: string } = {
  USD: "Dólar Americano (USD)",
  BRL: "Real (R$)",
  EUR: "Euro (€)"
};

const proposalFreightType: { [key in NonNullable<IProposal["scenarios"][number]["freight"]>["type"]]: string } = {
  Correios: "Correios",
  MedeirosRodoviario: "Medeiros - Rodoviário",
  Motoboy: "Motoboy",
  PlaceAereo: "Place - Aéreo",
  PlaceRodoviario: "Place - Rodoviário",
  Retira: "Retira",
  Outros: "Outros",
  AviatAereo: "AVIAT - Aéreo",
  AviatRodoviario: "AVIAT - Rodoviário",
};

const taxRegime: {[key in NonNullable<NonNullable<IClient["tax_details"]>["regime"]>]: string} = {
  SIMPLES_NACIONAL: "Simples Nacional",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro real",
  MEI: "MEI",
  ISENTO: "Isento",
  PRODUTOR_RURAL: "Produtor Rural",
  OUTRO: "Outro"
}

export const clientConstants = {
  types,
  sector,
  contactRole,
  contactDepartment,
  opportunitySalesStage,
  opportunityType,
  opportunityRecurrenceType,
  proposalCurrency,
  proposalFreightType,
  taxRegime
}
