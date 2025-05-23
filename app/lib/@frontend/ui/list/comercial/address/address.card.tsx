"use client";

import { ClipboardIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../component";
import { IAddress } from "@/app/lib/@backend/domain";

interface AddressCardProps {
    title?: string;
    address: IAddress;
    onRefresh?: () => void;
    onCopy?: () => void;
}

export function AddressCard({
    title = "Endereço:",
    address,
    onRefresh,
    onCopy,
}: AddressCardProps) {
    const copy = () => {
        if (onCopy) onCopy();
        else {
            const {
                street,
                number,
                district,
                city,
                state,
                zip_code,
                complement,
                reference,
            } = address;
            navigator.clipboard.writeText(
                `${street}, ${number}, ${district}\n${city} - ${state}, ${zip_code}\nComplemento: ${complement ?? ""}\nPonto de Referência: ${reference ?? ""}`
            );
        }
    };

    return (
        <div className="shadow-xl rounded-xl bg-slate-100 p-5 text-gray-800 h-70 w-96">
            <div className="flex items-center justify-between font-semibold">
                {title} {address.type}
                <div className="flex gap-1">
                    <Button variant={"secondary"}>
                        <ArrowPathIcon className="size-4" />
                    </Button>
                    <Button variant={"secondary"}>
                        <ClipboardIcon className="size-4" />
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
        </div>
    );
}
