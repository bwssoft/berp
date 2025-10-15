"use client";

import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Modal, ModalBody, ModalContent } from '@/frontend/ui/component/modal';

import { PlusIcon } from "@heroicons/react/24/outline";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SectorTable } from "../../../table/commercial/sector/sector.table";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

interface FormValues {
  name: string;
}

interface Props {
  open: boolean;
  closeModal: () => void;
  pagination: PaginationResult<ISector>;
  setCurrentPage: (page: number) => void;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleAdd: () => void;
  isPending: boolean;
  handleToggle: (s: ISector) => void;
  handleSave: () => void;
  onAskDelete: (s: ISector) => void;
  hasUnsavedChanges?: boolean;
  preventClose?: boolean;
}

export function SectorModal({
  open,
  closeModal,
  pagination,
  setCurrentPage,
  register,
  errors,
  handleAdd,
  isPending,
  handleToggle,
  handleSave,
  onAskDelete,
  hasUnsavedChanges = false,
}: Props) {
  // Prevent modal from closing during delete operations
  const handleModalClose = () => {
    closeModal();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title="Novo tipo de setor"
      className="bg-white"
      position="center"
    >
      <ModalContent>
        <ModalBody>
          <div className="flex items-end gap-2 mb-4">
            <Input
              {...register("name")}
              label="Tipo"
              placeholder="Digite o tipo de setor"
              error={errors.name?.message}
            />
            <Button
              type="button"
              title="Novo Setor"
              variant="ghost"
              disabled={isPending}
              onClick={handleAdd}
              className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <PlusIcon className="size-5" />
            </Button>
          </div>

          <SectorTable
            data={pagination}
            onToggle={handleToggle}
            onPageChange={setCurrentPage}
            onDelete={onAskDelete}
          />

          <div className="flex gap-4 my-4 justify-end">
            {hasUnsavedChanges ? (
              <div className="flex-1 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                <strong>Alterações não salvas</strong> - Pressione
                &quot;Salvar&quot; para confirmar
              </div>
            ) : (
              <div className="flex-1 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Nenhuma alteração</strong> - Todos os setores estão
                salvos
              </div>
            )}
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              variant={hasUnsavedChanges ? "default" : "ghost"}
            >
              Salvar
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

