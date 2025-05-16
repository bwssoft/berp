"use client";
import { IAddress } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component";
import { AddressCardList } from "@/app/lib/@frontend/ui/list/comercial/address/address.list";
import { AddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address";
import { useAddressModal } from "@/app/lib/@frontend/ui/modal/comercial/address/use-address.modal";

export function AddressForm() {
    const { openModal, open } = useAddressModal();

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
            created_at: new Date("2024-10-15T10:30:00Z"),
            updated_at: new Date("2025-04-22T15:45:00Z"),
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
            created_at: new Date("2024-10-15T10:30:00Z"),
            updated_at: new Date("2025-04-22T15:45:00Z"),
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
            created_at: new Date("2024-10-15T10:30:00Z"),
            updated_at: new Date("2025-04-22T15:45:00Z"),
        },
    ];

    return (
        <div>
            <AddressModal open={open} />
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-wrap gap-2">
                    <AddressCardList items={mockIAddresses} />
                </div>

                <Button onClick={openModal} type="button" className="h-fit">
                    Novo
                </Button>
            </div>
        </div>
    );
}
