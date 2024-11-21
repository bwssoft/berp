import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/client/repository/proposal.object.repository";
import { proposalObjectRepository } from "../../../repository/s3/proposal.repository";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";

class DeleteOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;
  documentRepository: IProposalRepository;

  constructor() {
    this.objectRepository = proposalObjectRepository;
    this.documentRepository = proposalRepository;
  }

  async execute(input: { proposal: IProposal; document_key: string }) {
    try {
      const { proposal, document_key } = input

      const [documentToRemove] = proposal.documents.filter(document => document.key === document_key)

      if (!documentToRemove) return

      await this.objectRepository.deleteOne(document_key)

      await this.documentRepository.updateOne(
        { id: proposal.id },
        { $pull: { documents: documentToRemove } }
      )
    } catch (err) {
      throw err
    }
  }
}

export const deleteOneProposalDocumentUsecase = singleton(
  DeleteOneProposalDocumentUsecase
);