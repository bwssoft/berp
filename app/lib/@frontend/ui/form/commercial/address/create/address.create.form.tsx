import { Controller } from "react-hook-form";
import { Button, Checkbox, Input, Combobox } from "../../../../component";
import { useAddressForm } from "./use-address.create.form";
import { INominatimInterface } from "@/app/lib/@backend/domain/@shared/gateway/nominatim.gateway.interface";

export function AddressCreateForm({ closeModal }: { closeModal: () => void }) {
    const {
        register,
        control,
        handleSubmit,
        errors,
        loadingCep,
        loadingSearch,
        suggestions,
        setSearch,
        handleSelectSuggestion,
    } = useAddressForm({ closeModal });

    const checkboxOptions = [
        { label: "Comercial", value: "Comercial" },
        { label: "Entrega", value: "Entrega" },
        { label: "Faturamento", value: "Faturamento" },
        { label: "Residencial", value: "Residencial" },
    ] as const;

    type Option = INominatimInterface;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 px-1 sm:px-6 lg:px-8 rounded-md pb-6"
        >
            <Controller
                control={control}
                name="address_search"
                render={({ field }) => (
                    <Combobox<Option>
                        data={suggestions}
                        keyExtractor={(o) => o.display_name}
                        displayValueGetter={(o) => o.display_name}
                        type="single"
                        behavior="search"
                        value={
                            field.value
                                ? suggestions.filter(
                                      (s) => s.display_name === field.value
                                  )
                                : []
                        }
                        onOptionChange={([selected]) => {
                            field.onChange(
                                selected ? selected.display_name : ""
                            );
                            if (selected) handleSelectSuggestion(selected);
                        }}
                        onSearchChange={(q) => {
                            field.onChange(q);
                            setSearch(q);
                        }}
                        placeholder="Digite rua, número ou bairro"
                        isLoading={loadingSearch}
                        error={errors.address_search?.message}
                    />
                )}
            />

            <Input
                label="Buscar pelo CEP"
                placeholder=""
                onLoad={() => {
                    loadingCep;
                }}
                {...register("zip_code")}
                error={errors.zip_code?.message}
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
                {...register("reference_point")}
                error={errors.reference_point?.message}
            />

            <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">Tipo</span>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <div className="flex gap-3">
                            {checkboxOptions.map((opt) => (
                                <Checkbox
                                    key={opt.value}
                                    label={opt.label}
                                    value={opt.value}
                                    checked={field.value?.includes(opt.value)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        if (checked)
                                            field.onChange([
                                                ...(field.value || []),
                                                opt.value,
                                            ]);
                                        else
                                            field.onChange(
                                                (field.value || []).filter(
                                                    (v) => v !== opt.value
                                                )
                                            );
                                    }}
                                />
                            ))}
                        </div>
                    )}
                />
                {errors.type?.message && (
                    <p className="text-xs text-red-600">
                        {errors.type.message}
                    </p>
                )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <Button
                    title="Cancelar"
                    type="button"
                    variant="secondary"
                    onClick={closeModal}
                >
                    Cancelar
                </Button>
                <Button title="Salvar" type="submit">
                    Salvar
                </Button>
            </div>
        </form>
    );
}
