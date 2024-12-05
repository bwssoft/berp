import { singleton } from "@/app/lib/util/singleton";
import { IProposal, IRuleRepository } from "../../../domain";
import { ruleRepository } from "@/app/lib/@backend/infra";
import { IRule, RuleOperator, RuleScope } from "../../../domain/sale/entity/rule.definition";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie.gateway.interface";

type Input = { scenario: Scenario }
type Output = {
  line_item_id: string,
  requires_contract: boolean
  omie_enterprise: OmieEnterpriseEnum
}[]
export interface IAnalyseProposalScenarioUsecase {
  execute(input: Input): Promise<Output>
}

type LineItem = IProposal["scenarios"][number]["line_items"][number]
type Scenario = IProposal["scenarios"][number]


class AnalyseProposalScenarioUsecase {
  ruleRepository: IRuleRepository;

  constructor() {
    this.ruleRepository = ruleRepository
  }

  async execute(input: Input) {
    try {
      const { scenario } = input;

      const result: Output = []

      const rules = await this.ruleRepository.findAll()

      const scenarioEnterprise = this.getOmieEnterprise(scenario, rules);

      if (scenarioEnterprise) {
        for (const lineItem of scenario.line_items) {
          result.push({
            line_item_id: lineItem.id,
            requires_contract: scenarioEnterprise.rule.requires_contract,
            omie_enterprise: OmieEnterpriseEnum[scenarioEnterprise.omie_enterprise]
          });
        }
      } else {
        for (const lineItem of scenario.line_items) {
          const lineItemEnterprise = this.getOmieEnterprise(lineItem, rules);
          if (lineItemEnterprise) {
            result.push({
              line_item_id: lineItem.id,
              requires_contract: lineItemEnterprise.rule.requires_contract,
              omie_enterprise: OmieEnterpriseEnum[lineItemEnterprise.omie_enterprise]
            });
          }
        }
      }

      return result
    } catch (err) {
      throw err;
    }
  }

  private evaluateRule(entity: LineItem | Scenario, rule: IRule): boolean {
    return rule.conditions.every((condition) => {
      const value = condition.field
        .split('.')
        .reduce((obj, key) => {
          if (obj && typeof obj === 'object') {
            return obj[key as keyof typeof obj];
          }
          return undefined;
        }, entity as any);

      switch (condition.operator) {
        case RuleOperator.Equal:
          return value === condition.value;
        case RuleOperator.NotEqual:
          return value !== condition.value;
        case RuleOperator.GreaterThan:
          return typeof value === 'number' && value > condition.value;
        case RuleOperator.GreaterThanEqual:
          return typeof value === 'number' && value >= condition.value;
        case RuleOperator.LessThan:
          return typeof value === 'number' && value < condition.value;
        case RuleOperator.LessThanEqual:
          return typeof value === 'number' && value <= condition.value;
        case RuleOperator.Contains:
          return Array.isArray(value) && value.includes(condition.value);
        case RuleOperator.NotContains:
          return Array.isArray(value) && !value.includes(condition.value);
        case RuleOperator.InRange:
          if (Array.isArray(condition.value) && condition.value.length === 2) {
            const [min, max] = condition.value;
            return typeof value === 'number' && value >= min && value <= max;
          }
          throw new Error("O operador 'InRange' requer um array com dois valores [min, max].");
        default:
          throw new Error(`Operador desconhecido: ${condition.operator}`);
      }
    });
  }


  private getOmieEnterprise(entity: LineItem | Scenario, rules: IRule[]): { omie_enterprise: OmieEnterpriseEnum; rule: IRule } | null {
    const applicableRules = rules.filter((rule) => {
      if (rule.scope === RuleScope.Scenario && entity.hasOwnProperty('line_items')) {
        return this.evaluateRule(entity as Scenario, rule);
      }
      if (rule.scope === RuleScope.LineItem && !entity.hasOwnProperty('line_items')) {
        return this.evaluateRule(entity as LineItem, rule);
      }
      return false;
    });

    const highestPriorityRule = applicableRules.reduce((bestRule, currentRule) => {
      return !bestRule || currentRule.priority < bestRule.priority ? currentRule : bestRule;
    }, null as IRule | null);

    return highestPriorityRule
      ? { omie_enterprise: highestPriorityRule.omie_enterprise, rule: highestPriorityRule }
      : null;
  }
}

export const analyseProposalScenarioUsecase = singleton(
  AnalyseProposalScenarioUsecase
);