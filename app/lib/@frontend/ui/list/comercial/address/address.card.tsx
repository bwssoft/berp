"use client";

import {
    ClipboardIcon,
    ArrowPathIcon,
    PencilIcon,
    ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Dialog } from "../../../component";
import { IAddress } from "@/app/lib/@backend/domain";
import { AddressUpdateModal } from "../../../modal/comercial/address/update";
import { useAddressModal } from "../../../modal/comercial/address/use-address.modal";

interface AddressCardProps {
    title?: string;
    address: IAddress;
    onRefresh?: () => void;
    onCopy?: () => void;
}

export function AddressCard({
    title = "Endereço",
    address,
    onRefresh,
    onCopy,
}: AddressCardProps) {
    const copy = () => {
        if (onCopy) {
            onCopy();
        } else {
            const {
                street,
                number,
                district,
                city,
                state,
                zip_code,
                complement,
                reference_point,
            } = address;

            let text = `${street}, ${number}, ${district}
            ${city} - ${state}, ${zip_code}`;

            if (complement) {
                text += `\nComplemento: ${complement}`;
            }

            if (reference_point) {
                text += `\nPonto de Referência: ${reference_point}`;
            }

            navigator.clipboard
                .writeText(text)
                .then(() => {
                    console.log("Endereço copiado com sucesso");
                })
                .catch(() => {
                    console.error("Falha ao copiar o endereço.");
                });
        }
    };
    const {
        closeModal,
        open,
        openModal,
        openModalDelete,
        setOpenModalDelete,
        deleteAdress,
        openModalDeleteCard,
    } = useAddressModal();
    return (
        <div className="shadow-xl rounded-xl bg-slate-100 p-5 text-gray-800 h-70 w-96">
            <AddressUpdateModal
                address={address}
                closeModal={closeModal}
                open={open}
            />
            <div className="flex items-center justify-between font-semibold">
                {title} {address.type?.join(" / ")}
                <div className="flex gap-1">
                    <Button onClick={openModalDeleteCard} variant={"secondary"}>
                        <ArchiveBoxXMarkIcon className="size-4" />
                    </Button>
                    <Button variant={"secondary"}>
                        <ArrowPathIcon className="size-4" />
                    </Button>
                    <Button onClick={copy} variant={"secondary"}>
                        <ClipboardIcon className="size-4" />
                    </Button>
                    <Button onClick={openModal} variant={"secondary"}>
                        <PencilIcon className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col pt-3">
                <div>
                    {address.street} ,{address.number}, {address.district}
                </div>
                <div>
                    {address.city} - {address.state}, {address.zip_code}
                </div>
                <div>Complemento: {address.complement ?? ""}</div>
                <div>Ponto de Referência: {address.reference_point ?? ""}</div>
            </div>

            <Dialog
                open={openModalDelete}
                setOpen={() => setOpenModalDelete(true)}
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold">Excluir endereço</h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Tem certeza que deseja excluir esse Endereço?
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setOpenModalDelete(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => deleteAdress(address.id)}
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
