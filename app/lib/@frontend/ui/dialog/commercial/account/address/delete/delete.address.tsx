"use client";

import { Dialog } from '@/frontend/ui/component/dialog';
import { Button } from '@/frontend/ui/component/button';

import {IAddress} from "@/app/lib/@backend/domain/commercial/entity/address.definition";

interface AddressDeleteDialogProps {
    address?: IAddress;
    open: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export function AddressDeleteDialog({
    address,
    open,
    onClose,
    onDelete,
    isLoading = false,
}: AddressDeleteDialogProps) {
    return (
        <Dialog open={open} setOpen={onClose}>
            <div className="p-4">
                <h2 className="text-lg font-semibold">Excluir endereço</h2>

                <p className="mt-2 text-sm text-gray-600">
                    Tem certeza que deseja excluir esse endereço?
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        disabled={isLoading}
                        onClick={() => {
                            if (address?.id) {
                                onDelete(address.id);
                            }
                        }}
                    >
                        {isLoading ? "Excluindo..." : "Confirmar"}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
