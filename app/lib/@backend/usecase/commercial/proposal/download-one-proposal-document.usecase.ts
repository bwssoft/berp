import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "@/app/lib/@backend/domain/commercial/repository/proposal.object.repository";
import { proposalObjectRepository } from "@/app/lib/@backend/infra";
import { IProposal } from "@/app/lib/@backend/domain/commercial/entity/proposal.definition";
import { setContentType } from "@/app/lib/util/get-content-type";

class DownloadOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;

  constructor() {
    this.objectRepository = proposalObjectRepository;
  }

  async execute(input: { document: NonNullable<IProposal["scenarios"][number]["signature_process"]>["documents"][number] }) {
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