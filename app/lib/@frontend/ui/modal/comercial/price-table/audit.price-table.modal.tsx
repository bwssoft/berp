"use client";

import {IAudit} from "@/backend/domain/admin/entity/audit.definition";
import {IPriceTable} from "@/backend/domain/commercial/entity/price-table.definition";
import { Modal, ModalBody, ModalContent } from "../../../component/modal";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { AuditTable } from "../../../table/admin/audit/audit.table";


interface Props {
  open: boolean;
  closeModal: () => void;
  priceTable?: Pick<IPriceTable, "id" | "name">;
  audits: PaginationResult<IAudit>;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isLoading?: boolean;
}

export function AuditPriceTableModal({
  open,
  closeModal,
  priceTable,
  audits,
  currentPage,
  handlePageChange,
  isLoading,
}: Props) {
  return (
    <Modal
      position="center"
      title={`Histórico de alterações da Tabela de Preço - ${priceTable?.name}`}
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

