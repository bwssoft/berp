import { singleton } from "@/app/lib/util/singleton";
import {
  EProductionOrderPriority,
  EProductionOrderStage,
} from "@/backend/domain/production/entity/production-order.definition";
import type { IFinancialOrderRepository } from "@/backend/domain/financial/repository/order.repository";
import type { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";
import type { IProposalRepository } from "@/backend/domain/commercial/repository/proposal.repository";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import {
  financialOrderRepository,
  productionOrderRepository,
  proposalRepository,
} from "@/backend/infra";
import { createManyProductionOrderUsecase } from "./create-many-production-order.usecase";
import {
  analyseProposalScenarioUsecase,
  IAnalyseProposalScenarioUsecase,
} from "@/backend/usecase/commercial/proposal/analyse-proposal-scenario.usecase";
import { nanoid } from "nanoid";

class CreateProductionOrderFromProposalUsecase {
  productionOrderRepository: IProductionOrderRepository;
  proposalRepository: IProposalRepository;
  financialOrderRepository: IFinancialOrderRepository;
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase;

  constructor() {
    this.productionOrderRepository = productionOrderRepository;
    this.proposalRepository = proposalRepository;
    this.financialOrderRepository = financialOrderRepository;
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase;
  }

  async execute(input: { proposal_id: string; scenario_id: string }) {
    const { proposal_id, scenario_id } = input;
    try {
      const [proposal, financial_order] = await Promise.all([
        this.proposalRepository.findOne({ id: proposal_id }),
        this.financialOrderRepository.findOne({ proposal_id }),
      ]);
      if (!proposal) {
        throw new Error("No proposal found");
      }

      const scenario = proposal.scenarios.find(
        (sce: IProposal["scenarios"][number]) => sce.id === scenario_id
      );
      if (!scenario) {
        throw new Error("No scenario found");
      }

      const analysis = await this.analyseProposalScenarioUsecase.execute({
        scenario,
      });

      type AnalysisItem = Awaited<
        ReturnType<IAnalyseProposalScenarioUsecase["execute"]>
      >[number];

      const production_orders = analysis
        .filter(
          (li: AnalysisItem) => li.requires_production_order
        )
        .map((li: AnalysisItem) => {
          const proposal_line_item = scenario.line_items.find(
            (l: IProposal["scenarios"][number]["line_items"][number]) =>
              l.id === li.line_item_id
          );
          if (!proposal_line_item) return undefined;
          return {
            enterprise_id: li.enterprise_id,
            active: true,
            client_id: proposal.client_id,
            financial_order_id: financial_order?.id,
            proposal: {
              id: proposal_id,
              scenario_line_item_id: proposal_line_item.id,
            },
            total_quantity: proposal_line_item.quantity,
            created_at: new Date(),
            product_id: proposal_line_item.product_id,
            id: crypto.randomUUID(),
            description: undefined,
            line_items: [
              {
                configuration_profile_id: null,
                parcial_quantity: proposal_line_item.quantity,
                id: nanoid(),
              },
            ],
            stage: EProductionOrderStage.in_approval,
            priority: EProductionOrderPriority.medium,
          };
        })
        .filter((el): el is NonNullable<typeof el> => el !== undefined);

      await createManyProductionOrderUsecase.execute(production_orders);
    } catch (error) {
      throw error;
    }
  }
}

export const createProductionOrderFromProposalUsecase = singleton(
  CreateProductionOrderFromProposalUsecase
);


