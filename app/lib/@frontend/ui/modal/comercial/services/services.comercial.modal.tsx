"use client";

import {IPriceTableService} from "@/backend/domain/commercial/entity/price-table-service.definition";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import { PlusIcon } from "@heroicons/react/24/outline";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { ServiceTable } from "../../../table/commercial/services/services.table";

interface FormValues {
  name: string;
}

interface Props {
  open: boolean;
  closeModal: () => void;
  pagination: PaginationResult<IPriceTableService>;
  setCurrentPage: (page: number) => void;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleAdd: () => void;
  isPending: boolean;
  onAskDelete: (s: IPriceTableService) => void;
}

export function ServiceModal({
  open,
  closeModal,
  pagination,
  setCurrentPage,
  register,
  errors,
  handleAdd,
  isPending,
  onAskDelete,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Novo Serviço"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <div className="flex items-end gap-2 mb-4">
            <Input
              {...register("name")}
              label="Serviço"
              placeholder="Digite o nome do serviço"
              error={errors.name?.message}
            />
            <Button
              type="button"
              title="Novo Serviço"
              variant="ghost"
              disabled={isPending}
              onClick={handleAdd}
              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <PlusIcon className="size-5" />
            </Button>
          </div>

          <ServiceTable
            data={pagination}
            onPageChange={setCurrentPage}
            onDelete={onAskDelete}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

