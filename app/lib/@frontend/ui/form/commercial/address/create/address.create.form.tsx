import { Controller } from "react-hook-form";
import { Button, Checkbox, Input, Combobox } from "../../../../component";
import { useAddressForm } from "./use-address.create.form";
import { INominatimInterface } from "@/app/lib/@backend/domain/@shared/gateway/nominatim.gateway.interface";
import { useRouter } from "next/navigation";

export function AddressCreateForm({
    closeModal,
    accountId,
}: {
    closeModal: () => void;
    accountId: string;
}) {
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        errors,
        formatCep,
        loadingCep,
        loadingSearch,
        suggestions,
        setSearch,
        handleSelectSuggestion,
    } = useAddressForm({
        closeModal: () => {
            closeModal();
            router.refresh();
        },
        accountId,
    });

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
            className="flex flex-col items-start  gap-4"
        >
            <Controller
                name="zip_code"
                control={control}
                render={({ field }) => (
                    <Input
                        label="Buscar pelo CEP"
                        placeholder="00000-000"
                        value={formatCep(field.value)}
                        onChange={(e) =>
                            field.onChange(formatCep(e.target.value))
                        }
                        error={errors.zip_code?.message}
                    />
                )}
            />
            <Input
                label="Logradouro"
                placeholder="Digite o nome da rua"
                {...register("street")}
                error={errors.street?.message}
            />
            <div className="grid grid-cols-2 gap-4  w-full">
                <Input
                    label="Número"
                    placeholder="Digite o número"
                    {...register("number")}
                    error={errors.number?.message}
                />
                <Input
                    label="Complemento"
                    placeholder="Apartamento, sala, etc."
                    {...register("complement")}
                    error={errors.complement?.message}
                />
                <Input
                    label="Bairro"
                    placeholder="Digite o bairro"
                    {...register("district")}
                    error={errors.district?.message}
                />
                <Input
                    label="Estado"
                    placeholder="Digite o estado"
                    {...register("state")}
                    error={errors.state?.message}
                />
                <Input
                    label="Cidade"
                    placeholder="Digite a cidade"
                    {...register("city")}
                    error={errors.city?.message}
                />
                <Input
                    label="Ponto de Referência"
                    placeholder="Próximo a..."
                    {...register("reference_point")}
                    error={errors.reference_point?.message}
                />
            </div>
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

            <div className="mt-4 flex justify-end gap-3  w-full">
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
