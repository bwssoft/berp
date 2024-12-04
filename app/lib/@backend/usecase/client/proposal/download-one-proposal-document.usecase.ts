import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/client/repository/proposal.object.repository";
import { proposalObjectRepository } from "../../../repository/s3/proposal.repository";
import { IProposal } from "../../../domain";
import { setContentType } from "@/app/lib/util/get-content-type";

class DownloadOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;

  constructor() {
    this.objectRepository = proposalObjectRepository;
  }

  async execute(input: { document: NonNullable<IProposal["document"]>[string][number] }) {
    try {
      const { document } = input
      const result = await this.objectRepository.findOne(document.key)
      if (!result) return null
      const { data, contentType } = result
      const name = `${document.name}.${setContentType(contentType)}`
      const uInt8Array = new Uint8Array(data)
      return { buffer: uInt8Array, name }
    } catch (err) {
      throw err
    }
  }
}

export const downloadOneProposalDocumentUsecase = singleton(
  DownloadOneProposalDocumentUsecase
);