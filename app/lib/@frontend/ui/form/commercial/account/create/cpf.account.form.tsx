import { Controller } from "react-hook-form";
import { useCreateAccountFormContext } from "@/app/lib/@frontend/context/create-account-form.context";
import { Input } from "../../../../component";

export function CpfAccountForm() {
  const { methods } = useCreateAccountFormContext();

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Nome completo"
        placeholder="Digite o nome completo"
        required
        {...methods.register("cpf.name")}
        error={methods.formState.errors.cpf?.name?.message}
      />
      <Controller
        control={methods.control}
        name="cpf.rg"
        render={({ field }) => (
          <Input
            label="RG"
            placeholder={"Digite o RG"}
            value={field.value || ""}
            onChange={field.onChange}
            error={methods.formState.errors.cpf?.rg?.message}
          />
        )}
      />
    </div>
  );
}
