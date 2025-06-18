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
      className="flex flex-col gap-2 px-1 sm:px-6 lg:px-8 rounded-md pb-6"
    >
      <Input
        label="Buscar pelo CEP"
        placeholder="00000-000"
        onLoad={() => {
          loadingCep;
        }}
        {...register("zip_code")}
        error={errors.zip_code?.message}
      />
      <Input
        label="Logradouro"
        placeholder="Digite o nome da rua"
        {...register("street")}
        error={errors.street?.message}
      />
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
                      field.onChange([...(field.value || []), opt.value]);
                    else
                      field.onChange(
                        (field.value || []).filter((v) => v !== opt.value)
                      );
                  }}
                />
              ))}
            </div>
          )}
        />
        {errors.type?.message && (
          <p className="text-xs text-red-600">{errors.type.message}</p>
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
