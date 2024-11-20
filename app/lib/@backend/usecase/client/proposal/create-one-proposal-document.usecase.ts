import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/client/repository/proposal.object.repository";
import { proposalObjectRepository } from "../../../repository/s3/proposal.repository";
import { formatDate, htmlToPdf } from "@/app/lib/util";
import { proposalToHtmlDataMapper } from "../../../domain/client/data-mapper/proposal-to-html";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";
import { nanoid } from "nanoid";

class CreateOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;
  documentRepository: IProposalRepository;

  constructor() {
    this.objectRepository = proposalObjectRepository;
    this.documentRepository = proposalRepository;
  }

  async execute(input: { proposal: IProposal; scenario_id: string }) {
    try {
      const { proposal, scenario_id } = input

      const now = Date.now()

      const [scenario] = proposal.scenarios.filter(scenario => scenario.id === scenario_id)
      proposal.scenarios = [scenario]

      const html = proposalToHtmlDataMapper.format(proposal)
      const buffer = await htmlToPdf(html, undefined);

      const key = this.generateKey(now, proposal.id, scenario_id)
      const name = this.generateFilaname(now, scenario.name)
      const size = buffer.length

      await this.objectRepository.create({ data: Buffer.from(buffer), key })

      await this.documentRepository.updateOne(
        { id: proposal.id },
        { $push: { documents: { id: nanoid(), scenario_id, key, name, size } } }
      )
    } catch (err) {
      throw err
    }
  }

  generateFilaname(now: number, scenario_name: string) {
    return `${formatDate(new Date(now), { includeHours: true }).replace(", ", "-")}__${scenario_name.toLowerCase().replace(/\s+/g, '-')}`
  }
  generateKey(now: number, proposal_id: string, scenario_id: string) {
    return `${proposal_id}/${scenario_id}/${now.toString()}.pdf`;
  }
}

export const createOneProposalDocumentUsecase = singleton(
  CreateOneProposalDocumentUsecase
);