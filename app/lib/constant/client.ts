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

const proposalInstallment = [
  { id: 1, label: "À vista", value: 1 },
  { id: 2, label: "2 Parcelas", value: 2 },
  { id: 3, label: "3 Parcelas", value: 3 },
  { id: 4, label: "4 Parcelas", value: 4 },
  { id: 5, label: "5 Parcelas", value: 5 },
  { id: 6, label: "6 Parcelas", value: 6 },
  { id: 7, label: "7 Parcelas", value: 7 },
  { id: 8, label: "8 Parcelas", value: 8 },
  { id: 9, label: "9 Parcelas", value: 9 },
  { id: 10, label: "10 Parcelas", value: 10 },
  { id: 11, label: "11 Parcelas", value: 11 },
  { id: 12, label: "12 Parcelas", value: 12 },
]

export const clientConstants = {
  types,
  sectors,
  contactRoles,
  contactDepartments,
  opportunitySalesStage,
  opportunityType,
  opportunityRecurrenceType,
  proposalCurrency,
  proposalFreightType,
  proposalInstallment
}
