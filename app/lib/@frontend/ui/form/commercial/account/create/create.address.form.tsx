"use client";
import { Input, Checkbox, Button } from "../../../../component";
import { useAddressForm } from "./use-create.address.form";

export function AddressForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useAddressForm();

    const onSubmit = handleSubmit((data: any) => {
        console.log(data);
    });

    return (
        <form
            action={() => {
                onSubmit;
            }}
            className="flex flex-col gap-2 bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10 w-full"
        >
            <Input
                label="Buscar pelo endereço"
                placeholder=""
                {...register("search_address")}
                error={errors.search_address?.message}
            />
            <Input
                label="Buscar pelo CEP"
                placeholder=""
                {...register("cep")}
                error={errors.cep?.message}
            />
            <Input
                label="Logradouro"
                placeholder=""
                {...register("street")}
                error={errors.street?.message}
            />
            <Input
                label="Número"
                placeholder=""
                {...register("number")}
                error={errors.number?.message}
            />
            <Input
                label="Complemento"
                placeholder=""
                {...register("complement")}
                error={errors.complement?.message}
            />
            <Input
                label="Bairro"
                placeholder=""
                {...register("district")}
                error={errors.district?.message}
            />
            <Input
                label="Estado"
                placeholder=""
                {...register("state")}
                error={errors.state?.message}
            />
            <Input
                label="Cidade"
                placeholder=""
                {...register("city")}
                error={errors.city?.message}
            />
            <Input
                label="Ponto de Referência"
                placeholder=""
                {...register("landmark")}
                error={errors.landmark?.message}
            />
            <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">
                    Tipo *
                </span>
                <div className="mt-1 grid grid-cols-2 gap-2">
                    <Checkbox
                        {...register("types")}
                        value="commercial"
                        label="Comercial"
                    />
                    <Checkbox
                        {...register("types")}
                        value="delivery"
                        label="Entrega"
                    />
                    <Checkbox
                        {...register("types")}
                        value="billing"
                        label="Faturamento"
                    />
                    <Checkbox
                        {...register("types")}
                        value="residential"
                        label="Residencial"
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
                <Button title="Cancelar" type="button" variant="secondary" />
                <Button title="Salvar" type="submit" />
            </div>
        </form>
    );
}
