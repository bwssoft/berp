"use client";

import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter } from "../../../component/modal";
import { AuditTable} from "../../../table/admin/audit";
import { IAudit, IUser } from "@/app/lib/@backend/domain";

interface AuditUserModalProps {
  open: boolean;
  closeModal: () => void;
  auditData: IAudit[];
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
