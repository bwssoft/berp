"use client";

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
} from "../../../component";
import { SectorTable } from "../../../table/commercial/sector";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSectorModal } from "./use-sector.comercial.modal";

interface Props {
    open: boolean;
    closeModal: () => void;
}

export function SectorModal({ open, closeModal }: Props) {
    const { sectors, register, errors, handleAdd, isPending } =
        useSectorModal();

    return (
        <>
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

                        <SectorTable initialData={sectors} />

                        <div className="flex gap-4 my-4 justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={closeModal}
                            >
                                Cancelar
                            </Button>
                            <Button type="button" onClick={closeModal}>
                                Salvar
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
