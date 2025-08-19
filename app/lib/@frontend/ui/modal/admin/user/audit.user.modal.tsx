"use client";

import React from "react";
import { Modal, ModalBody, ModalContent } from "../../../component/modal";
import { IAudit, IUser } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { AuditTable } from "../../../table/admin/audit/audit.table";

interface AuditUserModalProps {
  open: boolean;
  closeModal: () => void;
  auditData: PaginationResult<IAudit>;
  user?: Pick<IUser, "id" | "name">;
  handlePageChange: (page: number) => void;
  currentPage: number;
  isLoading?: boolean;
}

export function AuditUserModal({
  open,
  closeModal,
  auditData,
  user,
  handlePageChange,
  currentPage,
  isLoading,
}: AuditUserModalProps) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title={`Histórico de Alterações - ${user?.name}`}
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <AuditTable
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            data={auditData}
            isLoading={isLoading}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
