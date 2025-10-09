"use client";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { Modal, ModalBody, ModalContent } from "../../../../component/modal";
import {IAudit} from "@/backend/domain/admin/entity/audit.definition";
import {IProfile} from "@/backend/domain/admin/entity/profile.definition";
import { AuditTable } from "../../../../table/admin/audit/audit.table";

interface Props {
  open: boolean;
  closeModal: () => void;
  profile?: Pick<IProfile, "id" | "name">;
  audits: PaginationResult<IAudit>;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isLoading?: boolean;
}

export function AuditProfileModal({
  open,
  closeModal,
  profile,
  audits,
  currentPage,
  handlePageChange,
  isLoading,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Histórico de alterações de perfil - ${profile?.name}`}
      open={open}
      onClose={closeModal}
    >
      <ModalBody>
        <ModalContent>
          <AuditTable
            data={audits}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            isLoading={isLoading}
          />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}

