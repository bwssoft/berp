"use client";

import { AddressCard } from "./address.card";

type Address = Parameters<typeof AddressCard>[0]["address"];

interface AddressCardListProps {
    items: {
        id: string;
        address: Address;
        title?: string;
        onRefresh?: () => void;
        onCopy?: () => void;
    }[];
    className?: string;
}

export function AddressCardList({ items, className }: AddressCardListProps) {
    return (
        <div className={`flex flex-col gap-3 ${className ?? ""}`}>
            {items.map(({ id, address, title, onRefresh, onCopy }) => (
                <AddressCard
                    key={id}
                    title={title}
                    address={address}
                    onRefresh={onRefresh}
                    onCopy={onCopy}
                />
            ))}
        </div>
    );
}
