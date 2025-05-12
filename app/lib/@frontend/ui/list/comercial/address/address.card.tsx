"use client";

import { ClipboardIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../component";

type Address = {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    complement?: string;
    reference?: string;
};

interface AddressCardProps {
    title?: string;
    address: Address;
    onRefresh?: () => void;
    onCopy?: () => void;
}

export function AddressCard({
    title = "Endereço: ",
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
        <div className="shadow-xl rounded-xl bg-slate-100 p-5 text-gray-800 max-w-80 min-h-72">
            <div className="flex items-center justify-between font-semibold">
                {title}
                <div className="flex gap-1">
                    <Button variant={"secondary"}>
                        <ArrowPathIcon className="size-4" />
                    </Button>
                    <Button variant={"secondary"}>
                        <ClipboardIcon className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-4">
                {address.street}, {address.number}, {address.district}
                {address.city} - {address.state}, {address.zip_code}
                Complemento: {address.complement ?? ""}
                Ponto de Referência: {address.reference ?? ""}
            </div>
        </div>
    );
}
