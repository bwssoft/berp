"use client";
import { IAddress } from "@/app/lib/@backend/domain";
import { Input, Checkbox, Button } from "../../../../component";
import { AddressCardList } from "../../../../list/comercial/address/use-address.list";
import { useAddressForm } from "./use-address.account.form";

export function AddressForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useAddressForm();

    const onSubmit = handleSubmit((data: any) => {
        console.log(data);
    });

    const mockAddress: IAddress = {
        id: "a1b2c3d4",
        zip_code: "05055005",
        street: "Maple Avenue",
        district: "Greenwood",
        city: "Springfield",
        state: "California",
        number: "asassa",
        complement: "Apartment 5B",
        reference_point: "Near the old library",
        type: "Residencial",
        createdAt: new Date("2024-10-15T10:30:00Z"),
        updatedAt: new Date("2025-04-22T15:45:00Z"),
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                <AddressCardList items={[{ id: "aa", address: mockAddress }]} />
                <AddressCardList items={[{ id: "aa", address: mockAddress }]} />
                <AddressCardList items={[{ id: "aa", address: mockAddress }]} />
                <AddressCardList items={[{ id: "aa", address: mockAddress }]} />
                <AddressCardList items={[{ id: "aa", address: mockAddress }]} />
            </div>
            <Button onClick={() => {}}>Novo</Button>

            <footer>
                <Button variant={"outline"}>Cancelar</Button>
                <Button variant={"default"}>Salvar e próximo</Button>
            </footer>
        </div>
    );
}
