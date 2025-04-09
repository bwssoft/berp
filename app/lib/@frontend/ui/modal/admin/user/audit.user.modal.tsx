"use client";
import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter } from "../../../component/modal";
import { AuditTable} from "../../../table/admin/audit";
import { IAudit } from "@/app/lib/@backend/domain";


interface AuditUserModalProps {
  open: boolean;
  closeModal: () => void;
  auditData: IAudit[];
}

export default function AuditUserModal({ open, closeModal, auditData }: AuditUserModalProps) {
  return (
    <Modal open={open} onClose={closeModal} title="Histórico de Alterações" className="bg-white" position="center">
      <ModalContent>
        <ModalBody>
          <AuditTable data={auditData} />
        </ModalBody>
        <ModalFooter>
          <button
            onClick={closeModal}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            Fechar
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
