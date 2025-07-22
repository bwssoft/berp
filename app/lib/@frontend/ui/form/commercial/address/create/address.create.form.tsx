import { Controller } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { AddressFormSchema, useAddressForm } from "./use-address.create.form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AddressCreateForm({
  closeModal,
  accountId,
  onSubmit,
}: {
  closeModal: () => void;
  accountId: string;
  onSubmit: (data: AddressFormSchema, accountId: string) => Promise<void>;
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    errors,
    formatCep,
    loadingCep,
    isSubmitting,
  } = useAddressForm({
    closeModal: () => {
      closeModal();
      router.refresh();
    },
    accountId,
    onSubmit,
  });

  const checkboxOptions = [
    { label: "Comercial", value: "Comercial" },
    { label: "Entrega", value: "Entrega" },
    { label: "Faturamento", value: "Faturamento" },
    { label: "Residencial", value: "Residencial" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start  gap-4">
      <Controller
        name="zip_code"
        control={control}
        render={({ field }) => (
          <div className="w-full relative">
            <Input
              label="Buscar pelo CEP"
              placeholder="00000-000"
              value={formatCep(field.value)}
              onChange={(e) => field.onChange(formatCep(e.target.value))}
              error={errors.zip_code?.message}
              className={loadingCep ? "pr-10" : ""}
            />
            {loadingCep && (
              <div className="absolute right-3 top-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}
      />
      <Input
        label="Logradouro"
        placeholder="Digite o nome da rua"
        {...register("street")}
        error={errors.street?.message}
        disabled={loadingCep}
      />
      <div className="grid grid-cols-2 gap-4  w-full">
        <Input
          label="Número"
          placeholder="Digite o número"
          {...register("number")}
          error={errors.number?.message}
          disabled={loadingCep}
        />
        <Input
          label="Complemento"
          placeholder="Apartamento, sala, etc."
          {...register("complement")}
          error={errors.complement?.message}
          disabled={loadingCep}
        />
        <Input
          label="Bairro"
          placeholder="Digite o bairro"
          {...register("district")}
          error={errors.district?.message}
          disabled={loadingCep}
        />
        <Input
          label="Estado"
          placeholder="Digite o estado"
          {...register("state")}
          error={errors.state?.message}
          disabled={loadingCep}
        />
        <Input
          label="Cidade"
          placeholder="Digite a cidade"
          {...register("city")}
          error={errors.city?.message}
          disabled={loadingCep}
        />
        <Input
          label="Ponto de Referência"
          placeholder="Próximo a..."
          {...register("reference_point")}
          error={errors.reference_point?.message}
          disabled={loadingCep}
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
                  disabled={loadingCep}
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

      <div className="mt-4 flex justify-end gap-3  w-full">
        <Button
          title="Cancelar"
          type="button"
          variant="secondary"
          onClick={closeModal}
          disabled={loadingCep}
        >
          Cancelar
        </Button>
        <Button
          title="Salvar"
          type="submit"
          disabled={loadingCep || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
