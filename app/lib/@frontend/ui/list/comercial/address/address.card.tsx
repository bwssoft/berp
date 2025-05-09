"use client";

import { ClipboardIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

type Address = {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zip: string;
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
    title = "Endereço Fiscal",
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
                zip,
                complement,
                reference,
            } = address;
            navigator.clipboard.writeText(
                `${street}, ${number}, ${district}\n${city} - ${state}, ${zip}\nComplemento: ${complement ?? ""}\nPonto de Referência: ${reference ?? ""}`
            );
        }
    };

    return (
        <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-5 text-gray-800">
            <span className="font-semibold">{title}</span>
            <div className="mt-1 whitespace-pre-line">
                <span>
                    {address.street}, {address.number}, {address.district}
                </span>
                <span>
                    {address.city} - {address.state}, {address.zip}
                </span>
                <span> Complemento: {address.complement ?? ""}</span>
                <span> Ponto de Referência: {address.reference ?? ""}</span>
            </div>

            <div className="absolute right-2 top-2 flex gap-2">
                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        title="Atualizar"
                    >
                        <ArrowPathIcon className="size-4" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={copy}
                    className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    title="Copiar"
                >
                    <ClipboardIcon className="size-4" />
                </button>
            </div>
        </div>
    );
}
