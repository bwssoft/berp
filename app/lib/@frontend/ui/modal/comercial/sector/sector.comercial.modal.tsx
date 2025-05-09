"use client";

import React from "react";
import { Button, Combobox, Modal, ModalBody, ModalContent } from "../../../component";
import { SectorTable } from "../../../table/commercial/sector";
import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import { Controller } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/outline";

interface SectorModalProps {
    open: boolean;
    closeModal: () => void;
    sectors: ISector[];
}
const sectorOptions = [
    { id: "retail", name: "Varejo" },
    { id: "industry", name: "Indústria" },
    { id: "services", name: "Serviços" },
];
export function SectorModal({ open, closeModal, sectors }: SectorModalProps) {
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
                    <div>
                        <div className="flex items-end gap-2 mb-4">
                            <Controller
                                // control={control}
                                name="cnpj.sector"
                                render={({ field }) => (
                                    <Combobox
                                        label="Tipo"
                                        placeholder="Selecione o tipo de setor"
                                        className="mt-1 text-left"
                                        data={sectorOptions}
                                        onOptionChange={field.onChange}
                                        keyExtractor={(item) => item.id}
                                        displayValueGetter={(item) => item.name}
                                    />
                                )}
                            />

                            <Button
                                type="button"
                                title="Novo Setor"
                                variant="ghost"
                                onClick={() => {}}
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <PlusIcon className="size-5" />
                            </Button>
                        </div>
                        <SectorTable initialData={sectors} />
                        <div className="flex gap-4 my-4 justify-end">
                            <Button type="button" variant="ghost">
                                Cancelar
                            </Button>
                            <Button type="button">Salvar</Button>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
