"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter } from "../../../component/modal";
import { AuditTable} from "../../../table/admin/audit";
import { IAudit, IUser } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

interface AuditUserModalProps {
  open: boolean;
  closeModal: () => void;
  auditData: PaginationResult<IAudit>;
  user?: Pick<IUser, "id" | "name">
}

export function AuditUserModal({ open, closeModal, auditData, user }: AuditUserModalProps) {
  return (
    <Modal open={open} onClose={closeModal} title={`Histórico de Alterações - ${user?.name}`} className="bg-white" position="center">
      <ModalContent>
        <ModalBody>
          <AuditTable data={auditData} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
