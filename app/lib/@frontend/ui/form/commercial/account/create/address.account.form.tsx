"use client";
import { IAddress } from "@/app/lib/@backend/domain";
import { Input, Checkbox, Button } from "../../../../component";
import { AddressCardList } from "../../../../list/comercial/address/address.list";
import { AddressModal } from "../../../../modal/comercial/address";
import { useAddressModal } from "../../../../modal/comercial/address/use-address.comercial.modal";

export function AddressForm() {
    const { openModal } = useAddressModal();

    const mockIAddresses: IAddress[] = [
        {
            id: "a1b2c3d4",
            street: "Maple Avenue",
            district: "Greenwood",
            city: "Springfield",
            state: "California",
            zip_code: "90210",
            number: "742",
            complement: "Apartment 5B",
            reference_point: "Near the old library",
            type: "Residencial",
            createdAt: new Date("2024-10-15T10:30:00Z"),
            updatedAt: new Date("2025-04-22T15:45:00Z"),
        },
        {
            id: "a1b2c3d4",
            street: "Maple Avenue",
            district: "Greenwood",
            city: "Springfield",
            state: "California",
            zip_code: "90210",
            number: "742",
            complement: "Apartment 5B",
            reference_point: "Near the old library",
            type: "Residencial",
            createdAt: new Date("2024-10-15T10:30:00Z"),
            updatedAt: new Date("2025-04-22T15:45:00Z"),
        },
        {
            id: "a1b2c3d4",
            street: "Maple Avenue",
            district: "Greenwood",
            city: "Springfield",
            state: "California",
            zip_code: "90210",
            number: "742",
            complement: "Apartment 5B",
            reference_point: "Near the old library",
            type: "Residencial",
            createdAt: new Date("2024-10-15T10:30:00Z"),
            updatedAt: new Date("2025-04-22T15:45:00Z"),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap gap-2">
                    <AddressCardList items={mockIAddresses} />
                </div>

                <Button onClick={openModal} className="h-fit">
                    Novo
                </Button>
            </div>
            <AddressModal />
        </div>
    );
}
