import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/client/repository/proposal.object.repository";
import { proposalObjectRepository } from "../../../repository/s3/proposal.repository";
import { formatDate, htmlToPdf } from "@/app/lib/util";
import { proposalToHtmlDataMapper } from "../../../domain/client/data-mapper/proposal-to-html";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";
import { nanoid } from "nanoid";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie/omie.gateway.interface";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";

class CreateOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;
  proposalRepository: IProposalRepository;
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase


  constructor() {
    this.objectRepository = proposalObjectRepository;
    this.proposalRepository = proposalRepository;
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase

  }

  async execute(input: { scenario: IProposal["scenarios"][number], proposal: IProposal }) {
    try {
      const { scenario, proposal } = input

      const scenarioByEnterprise = await this.analyseProposalScenarioUsecase.execute({ scenario })

      const scenario_id = scenario.id
      const proposal_id = proposal.id
      proposal.scenarios = [scenario]

      const documents = await Promise.all(
        scenarioByEnterprise
          .filter(el => el.requires_contract)
          .map(async ({ omie_enterprise }) => {
            const now = Date.now()

            const html = proposalToHtmlDataMapper.format(proposal)
            const buffer = await htmlToPdf(html, undefined);

            const key = this.generateKey(now, proposal_id, scenario_id)
            const name = this.generateFilaname(omie_enterprise)
            const size = buffer.length
            return {
              buffer,
              key,
              name,
              size,
              omie_enterprise
            }
          })
      )

      await this.objectRepository.create(documents.map(doc => ({
        data: Buffer.from(doc.buffer),
        key: doc.key
      })))

      await this.proposalRepository.updateOne(
        { id: proposal_id },
        {
          $push: {
            [`document.${scenario_id}`]: {
              $each: documents.map(doc => ({
                id: nanoid(),
                key: doc.key,
                name: doc.name,
                size: doc.size,
                omie_enterprise: doc.omie_enterprise as OmieEnterpriseEnum
              }))
            }
          }
        }
      )
    } catch (err) {
      throw err
    }
  }

  generateFilaname(omie_enterprise: OmieEnterpriseEnum) {
    return `Contrato_${omie_enterprise.toUpperCase()}`; // Substitui espaços por traços
  }

  // scenario_name
  //   .toLowerCase()
  //   .normalize('NFD') // Separa caracteres com acento dos seus diacríticos
  //   .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
  //   .replace(/[^a-z0-9\s]/gi, '') // Remove outros caracteres especiais
  //   .replace(/\s+/g, '-')

  generateKey(now: number, proposal_id: string, scenario_id: string) {
    return `${proposal_id}/${scenario_id}/${now.toString()}.pdf`;
  }
}

export const createOneProposalDocumentUsecase = singleton(
  CreateOneProposalDocumentUsecase
);