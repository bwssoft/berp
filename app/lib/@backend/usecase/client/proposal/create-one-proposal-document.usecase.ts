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
import { object } from "zod";

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

      const documents = await Promise.all(Object.keys(scenarioByEnterprise).map(async enterprise => {
        const now = Date.now()

        const html = proposalToHtmlDataMapper.format(proposal)
        const buffer = await htmlToPdf(html, undefined);

        const key = this.generateKey(now, proposal_id, scenario_id)
        const name = this.generateFilaname(now, scenario.name)
        const size = buffer.length
        return {
          buffer,
          key,
          name,
          size,
          omie_enterprise: enterprise
        }
      }))

      await this.objectRepository.create(documents.map(doc => ({
        data: Buffer.from(doc.buffer),
        key: doc.key
      })))

      await this.proposalRepository.updateOne(
        { id: proposal_id },
        {
          $push: {
            documents: {
              $each: documents.map(doc => ({
                id: nanoid(),
                scenario_id,
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

  generateFilaname(now: number, scenario_name: string) {
    return `${formatDate(new Date(now), { includeHours: true })}__${scenario_name
      .toLowerCase()
      .normalize('NFD') // Separa caracteres com acento dos seus diacríticos
      .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
      .replace(/[^a-z0-9\s]/gi, '') // Remove outros caracteres especiais
      .replace(/\s+/g, '-')}`; // Substitui espaços por traços

  }
  generateKey(now: number, proposal_id: string, scenario_id: string) {
    return `${proposal_id}/${scenario_id}/${now.toString()}.pdf`;
  }
}

export const createOneProposalDocumentUsecase = singleton(
  CreateOneProposalDocumentUsecase
);