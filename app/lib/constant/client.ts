import { IProposal } from "../@backend/domain";

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

const sectors = {
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

const contactRoles = {
  analyst: "Analista",
  supervisor: "Supervisor",
  manager: "Gerente",
  director: "Diretor",
  president: "Presidente",
  owner: "Proprietário"
};

const contactDepartments = {
  administrative: "Administrativo",
  commercial: "Comercial",
  purchasing: "Compras",
  financial: "Financeiro",
  logistics: "Logística",
  operations: "Operações",
  presidency: "Presidência",
  products: "Produtos",
  owner: "Proprietário",
  support: "Suporte"
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


const proposalPhase: { [key in IProposal["phase"]]: string } = {
  accepted: "Aceito",
  negotiation: "Em negociação",
  proposal_sent: "Proposta Enviada",
  rejected: "Rejeitada"
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
export const clientConstants = {
  types,
  sectors,
  contactRoles,
  contactDepartments,
  opportunitySalesStage,
  opportunityType,
  opportunityRecurrenceType,
  proposalPhase,
  proposalCurrency,
  proposalFreightType
}
