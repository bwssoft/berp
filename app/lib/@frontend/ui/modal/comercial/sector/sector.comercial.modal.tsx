"use client";

import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
} from "../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SectorTable } from "../../../table/commercial/sector/sector.table";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

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
}: Props) {
    return (
        <Modal
            open={open}
            onClose={closeModal}
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
                    />

                    <div className="flex gap-4 my-4 justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={closeModal}
                        >
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            Salvar
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
