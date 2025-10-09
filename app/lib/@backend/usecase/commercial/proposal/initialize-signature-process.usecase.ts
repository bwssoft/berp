import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "@/app/lib/@backend/domain/commercial/repository/proposal.object.repository";
import { IProposalToHtmlDataMapper, proposalToHtmlDataMapper } from "@/app/lib/@backend/domain/commercial/data-mapper/proposal-to-html";
import { IProposal } from "@/app/lib/@backend/domain/commercial/entity/proposal.definition";
import { IProposalRepository } from "@/app/lib/@backend/domain/commercial/repository/proposal.repository";
import { proposalObjectRepository, proposalRepository } from "@/app/lib/@backend/infra";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";
import { htmlToPdf } from "@/app/lib/util";
import { nanoid } from "nanoid";

class InitializeSignatureProcessUscase {
  proposalRepository: IProposalRepository;
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase
  proposalToHtmlDataMapper: IProposalToHtmlDataMapper
  proposalObjectRepository: IProposalObjectRepository

  constructor() {
    this.proposalRepository = proposalRepository
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
    this.proposalToHtmlDataMapper = proposalToHtmlDataMapper
    this.proposalObjectRepository = proposalObjectRepository;
  }

  async execute(input: { proposal_id: string, scenario_id: string }) {
    const { proposal_id, scenario_id } = input
    try {
      const proposal = await this.proposalRepository.findOne({ id: proposal_id })
      if (!proposal) {
        throw new Error("No proposal found")
      }

      const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
      if (!scenario) {
        throw new Error("No scenario found")
      }

      const analysis = await this.analyseProposalScenarioUsecase.execute({ scenario })

      const documents = await Promise.all(
        analysis
          .filter(el => el.requires_contract)
          .map(async ({ enterprise_id }) => {
            const html = proposalToHtmlDataMapper.format(proposal)
            const buffer = await htmlToPdf(html, undefined);

            const key = this.generateKey(proposal_id, scenario_id)
            const name = this.generateFilaname(enterprise_id)
            const size = buffer.length
            return {
              buffer,
              key,
              name,
              size,
              enterprise_id
            }
          })
      )

      await this.proposalObjectRepository.create(documents.map(doc => ({
        data: Buffer.from(doc.buffer),
        key: doc.key
      })))

      const signature_process: NonNullable<IProposal["scenarios"][number]["signature_process"]> = {
        contact: [],
        documents: documents.map(({ buffer, ...rest }) => ({ ...rest, id: nanoid() })),
        id: crypto.randomUUID()
      }

      await this.proposalRepository.updateOne(
        {
          id: proposal_id,
          "scenarios.id": scenario_id
        },
        {
          $set: {
            ["scenarios.$.signature_process"]: signature_process
          }
        }
      )
    } catch (err) {
      throw err;
    }
  }


  generateFilaname(enterprise_id: string) {
    return `Contrato_${enterprise_id}`; // Substitui espaços por traços
  }
  generateKey(proposal_id: string, scenario_id: string) {
    return `${proposal_id}/${scenario_id}/${nanoid()}.pdf`;
  }

}

export const initializeSignatureProcessUscase = singleton(
  InitializeSignatureProcessUscase
);