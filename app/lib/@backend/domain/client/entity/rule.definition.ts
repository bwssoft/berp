import { OmieEnterpriseEnum } from "../../@shared/gateway/omie/omie.gateway.interface";
import { IProposal } from "./proposal.definition";

export interface IRule {
  id: string; // Identificador único da regra
  name: string; // Nome descritivo da regra
  description?: string; // Descrição opcional
  scope: RuleScope; // Escopo da regra (Scenario ou LineItem)
  conditions: RuleCondition[]; // Lista de condições que determinam a aplicação
  omie_enterprise: OmieEnterpriseEnum; // Empresa Omie associada à regra
  created_at: Date; // Data de criação
  priority: number
}

export enum RuleScope {
  Scenario = 'scenario', // Regras para cenários
  LineItem = 'line_item', // Regras para itens de linha
}

interface RuleCondition {
  field: keyof IProposal["scenarios"][number]["line_items"][number] | keyof IProposal["scenarios"][number]; // Campo a ser avaliado
  operator: RuleOperator; // Operador lógico
  value: any; // Valor esperado (pode ser de qualquer tipo devido à diversidade de condições)
}

export enum RuleOperator {
  Equal = 'equal',
  NotEqual = 'not_equal',
  GreaterThan = 'greater_than',
  GreaterThanEqual = 'greater_than_equal',
  LessThan = 'less_than',
  LessThanEqual = 'less_than_equal',
  Contains = 'contains',
  NotContains = 'not_contains',
  InRange = 'in_range',
}